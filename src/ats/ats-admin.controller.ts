import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { AtsConfigService } from './ats-config.service';

@Controller('admin/ats')
@UseGuards(AdminGuard)
export class AtsAdminController {
  constructor(private readonly atsConfig: AtsConfigService) {}

  @Get('config')
  status() {
    return this.atsConfig.status();
  }

  @Get('seasons')
  async seasons() {
    const [status, seasons] = await Promise.all([
      this.atsConfig.status(),
      this.atsConfig.listSeasons(),
    ]);
    return {
      activeSeasonId: status.activeSeasonId,
      seasons,
    };
  }

  @Put('season')
  selectSeason(@Body('seasonId') seasonId: string) {
    return this.atsConfig.selectSeason(seasonId);
  }
}
