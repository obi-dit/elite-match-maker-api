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
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';
import { AdminUser } from '../auth/admin.decorator';
import { CreatePodcastDto } from '../podcast/dto/podcast.dto';
import { UpdatePodcastDto } from '../podcast/dto/podcast.dto';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard
  @Get('dashboard')
  async getDashboard(@AdminUser() user: any) {
    return await this.adminService.getDashboardStats();
  }

  // Podcast Management
  @Post('podcasts')
  async createPodcast(
    @Body() createPodcastDto: CreatePodcastDto,
    @AdminUser() user: any,
  ) {
    return await this.adminService.createPodcast(createPodcastDto);
  }

  @Post('podcasts/upload')
  @UseInterceptors(FilesInterceptor('files', 3))
  async uploadPodcast(
    @Body() createPodcastDto: any,
    @UploadedFiles() files: Express.Multer.File[],
    @AdminUser() user: any,
  ) {
    return await this.adminService.uploadPodcast(createPodcastDto, files);
  }

  @Get('podcasts')
  async getAllPodcasts(@AdminUser() user: any) {
    return await this.adminService.getAllPodcasts();
  }

  @Get('podcasts/:id')
  async getPodcastById(
    @Param('id', ParseIntPipe) id: number,
    @AdminUser() user: any,
  ) {
    return await this.adminService.getPodcastById(id);
  }

  @Put('podcasts/:id')
  async updatePodcast(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePodcastDto: UpdatePodcastDto,
    @AdminUser() user: any,
  ) {
    return await this.adminService.updatePodcast(id, updatePodcastDto);
  }

  @Delete('podcasts/:id')
  async deletePodcast(
    @Param('id', ParseIntPipe) id: number,
    @AdminUser() user: any,
  ) {
    return await this.adminService.deletePodcast(id);
  }

  // Client Management
  @Get('clients')
  async getClients(@AdminUser() user: any) {
    return await this.adminService.getClients();
  }

  @Get('clients/:id')
  async getClientById(
    @Param('id', ParseIntPipe) id: number,
    @AdminUser() user: any,
  ) {
    return await this.adminService.getClientById(id);
  }

  @Put('clients/:id/status')
  async updateClientStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
    @AdminUser() user: any,
  ) {
    return await this.adminService.updateClientStatus(id, isActive);
  }

  // Applicant Management
  @Get('applicants')
  async getApplicants(@AdminUser() user: any) {
    return await this.adminService.getApplicants();
  }

  @Get('applicants/:id')
  async getApplicantById(
    @Param('id', ParseIntPipe) id: number,
    @AdminUser() user: any,
  ) {
    return await this.adminService.getApplicantById(id);
  }

  @Put('applicants/:id/status')
  async updateApplicantStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isApproved') isApproved: boolean,
    @AdminUser() user: any,
  ) {
    return await this.adminService.updateApplicantStatus(id, isApproved);
  }
}
