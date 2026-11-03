import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CLIENT_CREATED, ClientCreatedEvent } from './ats-sync.events';
import { AtsConfigService } from './ats-config.service';

@Injectable()
export class AtsSyncListener {
  private readonly logger = new Logger(AtsSyncListener.name);

  constructor(private readonly atsConfig: AtsConfigService) {}

  @OnEvent(CLIENT_CREATED, { async: true })
  async handleClientCreated(event: ClientCreatedEvent) {
    const connection = this.atsConfig.connection();
    const baseUrl = connection.baseUrl;
    const apiKey = process.env.DIT_ATS_API_KEY?.trim();
    const apiSecret = process.env.DIT_ATS_API_SECRET?.trim();
    const seasonId = await this.atsConfig.activeSeasonId();

    if (!baseUrl || !apiKey || !apiSecret || !seasonId) {
      this.logger.warn(
        'DIT ATS sync skipped: DIT_ATS_* env vars not configured',
      );
      return;
    }
    if (!event.email) {
      this.logger.warn(
        `DIT ATS sync skipped for user ${event.userId}: no email`,
      );
      return;
    }

    const { firstName, lastName } = this.resolveName(event);

    try {
      const res = await fetch(
        `${baseUrl.replace(/\/$/, '')}/integrations/matchmaking/seasons/${seasonId}/applicants`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'x-api-secret': apiSecret,
          },
          body: JSON.stringify({
            email: event.email,
            firstName,
            lastName,
            phone: event.phone || undefined,
            externalReference: `elite-user-${event.userId}`,
            metadata: { gender: event.gender },
          }),
          signal: AbortSignal.timeout(10_000),
        },
      );

      if (!res.ok) {
        this.logger.error(
          `DIT ATS sync failed for user ${event.userId}: ${res.status} ${await res.text()}`,
        );
        return;
      }
      this.logger.log(
        `User ${event.userId} added to DIT ATS season ${seasonId}`,
      );
    } catch (err) {
      this.logger.error(
        `DIT ATS sync error for user ${event.userId}: ${(err as Error).message}`,
      );
    }
  }

  private resolveName(event: ClientCreatedEvent) {
    if (event.firstName?.trim() || event.lastName?.trim()) {
      return {
        firstName: event.firstName?.trim() || 'Client',
        lastName: event.lastName?.trim() || '-',
      };
    }
    const parts = (event.fullName ?? '').trim().split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] ?? 'Client',
      lastName: parts.slice(1).join(' ') || '-',
    };
  }
}
