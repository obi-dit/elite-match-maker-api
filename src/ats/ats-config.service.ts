import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AtsSeason {
  id: string;
  name: string;
  status: string;
  applicationOpensAt: string;
  applicationClosesAt: string;
  filmingStartsAt: string | null;
  targetCohortSize: number | null;
}

export interface AtsConnection {
  configured: boolean;
  baseUrl: string | null;
  apiKeyHint: string | null;
  secretConfigured: boolean;
  envSeasonId: string | null;
}

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

@Injectable()
export class AtsConfigService {
  private readonly logger = new Logger(AtsConfigService.name);

  constructor(private readonly prisma: PrismaService) {}

  connection(): AtsConnection {
    const baseUrl = this.env('DIT_ATS_BASE_URL');
    const apiKey = this.env('DIT_ATS_API_KEY');
    const apiSecret = this.env('DIT_ATS_API_SECRET');
    return {
      configured: Boolean(baseUrl && apiKey && apiSecret),
      baseUrl,
      apiKeyHint: apiKey ? this.mask(apiKey) : null,
      secretConfigured: Boolean(apiSecret),
      envSeasonId: this.env('DIT_ATS_SEASON_ID'),
    };
  }

  /** Season used when a new client is synced. A saved choice wins over the env default. */
  async activeSeasonId(): Promise<string | null> {
    const saved = await this.prisma.atsSetting.findUnique({ where: { id: 1 } });
    return saved?.seasonId?.trim() || this.env('DIT_ATS_SEASON_ID');
  }

  async status() {
    const connection = this.connection();
    const activeSeasonId = await this.activeSeasonId();
    const saved = await this.prisma.atsSetting.findUnique({ where: { id: 1 } });
    return {
      ...connection,
      activeSeasonId,
      seasonSource: saved?.seasonId ? 'admin' : connection.envSeasonId ? 'environment' : 'none',
      updatedAt: saved?.updatedAt ?? null,
    };
  }

  async listSeasons(): Promise<AtsSeason[]> {
    const payload = await this.request<{ seasons: AtsSeason[] }>(
      '/integrations/matchmaking/seasons',
    );
    return payload.seasons ?? [];
  }

  async selectSeason(seasonId: string) {
    const id = seasonId?.trim();
    if (!id || !UUID.test(id)) {
      throw new BadRequestException('A valid season id is required');
    }

    const seasons = await this.listSeasons();
    const season = seasons.find((item) => item.id === id);
    if (!season) {
      throw new BadRequestException(
        'That season is not available to this integration',
      );
    }

    const saved = await this.prisma.atsSetting.upsert({
      where: { id: 1 },
      create: { id: 1, seasonId: id },
      update: { seasonId: id },
    });

    return {
      activeSeasonId: saved.seasonId,
      seasonSource: 'admin' as const,
      season,
      updatedAt: saved.updatedAt,
    };
  }

  private async request<T>(path: string): Promise<T> {
    const connection = this.connection();
    const apiKey = this.env('DIT_ATS_API_KEY');
    const apiSecret = this.env('DIT_ATS_API_SECRET');
    if (!connection.baseUrl || !apiKey || !apiSecret) {
      throw new ServiceUnavailableException(
        'DIT ATS is not configured. Set DIT_ATS_BASE_URL, DIT_ATS_API_KEY, and DIT_ATS_API_SECRET.',
      );
    }

    let response: Response;
    try {
      response = await fetch(`${connection.baseUrl}${path}`, {
        headers: {
          'x-api-key': apiKey,
          'x-api-secret': apiSecret,
        },
        signal: AbortSignal.timeout(8_000),
      });
    } catch (error) {
      this.logger.error(`DIT ATS request failed: ${(error as Error).message}`);
      throw new ServiceUnavailableException(
        'DIT ATS could not be reached. Check that it is running and DIT_ATS_BASE_URL is correct.',
      );
    }

    if (!response.ok) {
      const detail = await response.text();
      this.logger.error(`DIT ATS responded ${response.status}: ${detail}`);
      throw new ServiceUnavailableException(
        `DIT ATS rejected the request (${response.status}).`,
      );
    }

    const body = (await response.json()) as T & {
      success?: boolean;
      data?: T;
    };
    if (
      body &&
      typeof body === 'object' &&
      body.success === true &&
      'data' in body
    ) {
      return body.data as T;
    }
    return body;
  }

  private env(name: string) {
    const value = process.env[name]?.trim();
    return value || null;
  }

  private mask(value: string) {
    if (value.length <= 8) return '••••';
    return `${value.slice(0, 4)}••••${value.slice(-4)}`;
  }
}
