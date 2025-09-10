import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  IsBoolean,
  IsDateString,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { PodcastStatus, PodcastType } from '@prisma/client';

export class CreatePodcastDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsEnum(PodcastStatus)
  status?: PodcastStatus;

  @IsOptional()
  @IsEnum(PodcastType)
  type?: PodcastType;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  streamKey?: string;

  @IsOptional()
  @IsBoolean()
  isLive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}

export class UpdatePodcastDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  audioUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsEnum(PodcastStatus)
  status?: PodcastStatus;

  @IsOptional()
  @IsEnum(PodcastType)
  type?: PodcastType;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  streamKey?: string;

  @IsOptional()
  @IsBoolean()
  isLive?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];
}

export class PodcastQueryDto {
  @IsOptional()
  @IsEnum(PodcastStatus)
  status?: PodcastStatus;

  @IsOptional()
  @IsEnum(PodcastType)
  type?: PodcastType;

  @IsOptional()
  @IsBoolean()
  isLive?: boolean;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}
