import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/admin.guard';
import { UserDecorator } from '../auth/admin.decorator';

@Controller('admin')
@UseGuards(AdminGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard(@UserDecorator() user: any) {
    return await this.adminService.getDashboardStats();
  }

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

  @Get('likes')
  async getAllLikes(@UserDecorator() user: any) {
    return await this.adminService.getAllLikes();
  }
}
