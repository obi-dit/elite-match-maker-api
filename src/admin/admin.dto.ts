import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadPodcastDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  scheduledAt?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (!value) return [];

    // If it's already an array, return it
    if (Array.isArray(value)) return value;

    // If it's a JSON string (e.g., '["love"]'), parse it
    try {
      return JSON.parse(value);
    } catch {
      // If it's a comma-separated string, split it
      return value
        .split(',')
        .map((item: string) => item.trim())
        .filter(Boolean);
    }
  })
  categories?: string[];
}
