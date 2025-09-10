import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PodcastService } from './podcast.service';
import {
  CreatePodcastDto,
  UpdatePodcastDto,
  PodcastQueryDto,
} from './dto/podcast.dto';
import { UserDecorator } from '../decorators/user.decorator';

@Controller('podcast')
export class PodcastController {
  constructor(private readonly podcastService: PodcastService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPodcastDto: CreatePodcastDto) {
    return this.podcastService.createPodcast(createPodcastDto);
  }

  @Get()
  findAll(@Query() query: PodcastQueryDto) {
    return this.podcastService.findAllPodcasts(query);
  }

  @Get('dashboard')
  getMemberDashboard(@UserDecorator('id') userId: number) {
    return this.podcastService.getMemberDashboard(userId);
  }

  @Get('live')
  getLivePodcasts() {
    return this.podcastService.findAllPodcasts({
      isLive: true,
      take: 10,
    });
  }

  @Get('new')
  getNewPodcasts() {
    return this.podcastService.findAllPodcasts({
      status: 'PUBLISHED' as any,
      type: 'RECORDED' as any,
      take: 10,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.podcastService.findPodcastById(id);
  }

  @Post(':id/access')
  @HttpCode(HttpStatus.OK)
  recordAccess(
    @Param('id', ParseIntPipe) podcastId: number,
    @UserDecorator('id') userId: number,
  ) {
    return this.podcastService.recordPodcastAccess(userId, podcastId);
  }

  @Post(':id/start-live')
  @HttpCode(HttpStatus.OK)
  startLiveStream(@Param('id', ParseIntPipe) id: number) {
    return this.podcastService.startLiveStream(id);
  }

  @Post(':id/end-live')
  @HttpCode(HttpStatus.OK)
  endLiveStream(@Param('id', ParseIntPipe) id: number) {
    return this.podcastService.endLiveStream(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePodcastDto: UpdatePodcastDto,
  ) {
    return this.podcastService.updatePodcast(id, updatePodcastDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.podcastService.deletePodcast(id);
  }
}
