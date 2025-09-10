import { Module } from '@nestjs/common';
import { AddOnController } from './addon.controller';
import { AddOnService } from './addon.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AddOnController],
  providers: [AddOnService],
  exports: [AddOnService],
})
export class AddOnModule {}




