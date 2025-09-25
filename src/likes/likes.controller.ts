import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { Body } from '@nestjs/common';
import { GENDER } from '@prisma/client';
import { Roles } from 'src/auth/roles.decorator';
import { LikesDto } from './likes.dto';
import { UserDecorator } from 'src/decorators/user.decorator';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('create')
  @Roles(GENDER.MALE)
  async createLike(@Body() body: LikesDto) {
    return this.likesService.createLike(body.clientId, body.applicantId);
  }

  @Get('liked-applicants')
  @Roles(GENDER.MALE)
  async getLikedApplicants(@UserDecorator('id') clientId: number) {
    return this.likesService.getLikedApplicants(clientId);
  }

  @Delete('unlike/:id')
  @Roles(GENDER.MALE)
  async unlikeApplicant(
    @UserDecorator('id') clientId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.likesService.unlikeApplicant(id);
  }
}
