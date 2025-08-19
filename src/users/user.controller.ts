import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UserResponseDto } from './dto';
import { CreateMaleUserDto } from './dto/create-male-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Post('male')
  @HttpCode(HttpStatus.CREATED)
  async createMaleUser(
    @Body() createMaleUserDto: CreateMaleUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.createMaleUser(createMaleUserDto);
  }

  @Put(':id/photos')
  @HttpCode(HttpStatus.OK)
  async updateUserPhotos(
    @Param('id', ParseIntPipe) id: number,
    @Body() photoUrls: { photo1?: string; photo2?: string; photo3?: string },
  ): Promise<UserResponseDto> {
    return this.userService.updateUserPhotos(id, photoUrls);
  }

  @Put(':id/video')
  @HttpCode(HttpStatus.OK)
  async updateUserVideo(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { videoUrl: string },
  ): Promise<UserResponseDto> {
    return this.userService.updateUserVideo(id, body.videoUrl);
  }

  @Get()
  async findAllUsers(): Promise<UserResponseDto[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  async findUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.userService.findUserById(id);
  }
}
