import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';
import { UserDecorator } from '../auth/admin.decorator';
import { CreatePodcastDto } from '../podcast/dto/podcast.dto';
import { UpdatePodcastDto } from '../podcast/dto/podcast.dto';
import { UploadPodcastDto } from './admin.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard
  @Get('dashboard')
  async getDashboard(@UserDecorator() user: any) {
    return await this.adminService.getDashboardStats();
  }

  // Podcast Management
  @Post('podcasts')
  async createPodcast(
    @Body() createPodcastDto: CreatePodcastDto,
    @UserDecorator() user: any,
  ) {
    return await this.adminService.createPodcast(createPodcastDto);
  }

  @Post('podcasts/upload')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audioFile', maxCount: 1 },
      { name: 'videoFile', maxCount: 1 },
      { name: 'thumbnailFile', maxCount: 1 },
    ]),
  )
  async uploadPodcast(
    @Body() createPodcastDto: UploadPodcastDto,
    @UploadedFiles()
    files: {
      audioFile?: Express.Multer.File[];
      videoFile?: Express.Multer.File[];
      thumbnailFile?: Express.Multer.File[];
    },
    @UserDecorator() user: any,
  ) {
    // Extract single files from arrays
    const fileData = {
      audioFile: files?.audioFile?.[0],
      videoFile: files?.videoFile?.[0],
      thumbnailFile: files?.thumbnailFile?.[0],
    };

    return await this.adminService.uploadPodcast(createPodcastDto, fileData);
  }

  @Get('podcasts')
  async getAllPodcasts(@UserDecorator() user: any) {
    return await this.adminService.getAllPodcasts();
  }

  @Get('podcasts/:id')
  async getPodcastById(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: any,
  ) {
    return await this.adminService.getPodcastById(id);
  }

  @Put('podcasts/:id')
  async updatePodcast(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePodcastDto: UpdatePodcastDto,
    @UserDecorator() user: any,
  ) {
    return await this.adminService.updatePodcast(id, updatePodcastDto);
  }

  @Delete('podcasts/:id')
  async deletePodcast(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: any,
  ) {
    return await this.adminService.deletePodcast(id);
  }

  // Client Management
  @Get('clients')
  async getClients(@UserDecorator() user: any) {
    return await this.adminService.getClients();
  }

  @Get('clients/:id')
  async getClientById(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: any,
  ) {
    return await this.adminService.getClientById(id);
  }

  @Put('clients/:id/status')
  async updateClientStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
    @UserDecorator() user: any,
  ) {
    return await this.adminService.updateClientStatus(id, isActive);
  }

  // Applicant Management
  @Get('applicants')
  async getApplicants(@UserDecorator() user: any) {
    return await this.adminService.getApplicants();
  }

  @Get('applicants/:id')
  async getApplicantById(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: any,
  ) {
    return await this.adminService.getApplicantById(id);
  }

  @Put('applicants/:id/status')
  async updateApplicantStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isApproved') isApproved: boolean,
    @UserDecorator() user: any,
  ) {
    return await this.adminService.updateApplicantStatus(id, isApproved);
  }

  // Likes Management
  @Get('likes')
  async getAllLikes(@UserDecorator() user: any) {
    return await this.adminService.getAllLikes();
  }
}
