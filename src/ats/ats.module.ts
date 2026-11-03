import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { AtsSyncListener } from './ats-sync.listener';
import { AtsConfigService } from './ats-config.service';
import { AtsAdminController } from './ats-admin.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AtsAdminController],
  providers: [AtsSyncListener, AtsConfigService],
  exports: [AtsConfigService],
})
export class AtsModule {}
