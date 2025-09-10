import { Module } from '@nestjs/common';
import { PodcastService } from './podcast.service';
import { PodcastController } from './podcast.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PodcastController],
  providers: [PodcastService],
  exports: [PodcastService],
})
export class PodcastModule {}

