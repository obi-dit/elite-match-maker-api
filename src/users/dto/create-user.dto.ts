import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsEmail,
  Min,
  Max,
} from 'class-validator';
import { City, EnglishProficiency, Children, GENDER } from '@prisma/client';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNumber()
  @Min(28)
  @Max(32)
  age: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER;

  @IsOptional()
  @IsEnum(City)
  cityOfResidence?: City;

  @IsOptional()
  @IsString()
  cityOther?: string;

  @IsOptional()
  @IsEnum(EnglishProficiency)
  englishProficiency?: EnglishProficiency;

  @IsNumber()
  @Min(100)
  @Max(250)
  heightCm: number;

  @IsNumber()
  @Min(30)
  @Max(200)
  weightKg: number;

  @IsOptional()
  @IsBoolean()
  isSingleAndAvailable?: boolean;

  @IsOptional()
  @IsBoolean()
  comfortableFilming?: boolean;

  @IsOptional()
  @IsBoolean()
  traditionalWantsMarriage?: boolean;

  @IsOptional()
  @IsBoolean()
  willingToCompete?: boolean;

  @IsOptional()
  @IsEnum(Children)
  children?: Children;

  @IsOptional()
  @IsBoolean()
  willingLieDetector?: boolean;

  @IsOptional()
  @IsBoolean()
  consentForMedia?: boolean;

  @IsOptional()
  @IsString()
  personalityThreeWords?: string;

  @IsOptional()
  @IsString()
  relationshipGoals?: string;

  @IsOptional()
  @IsString()
  attractionToOlderMen?: string;

  @IsOptional()
  @IsString()
  whyGoodWife?: string;

  @IsOptional()
  @IsString()
  talentsOrHobbies?: string;

  @IsBoolean()
  comfortableBikiniChallenges: boolean;

  @IsOptional()
  @IsString()
  photo1?: string;

  @IsOptional()
  @IsString()
  photo2?: string;

  @IsOptional()
  @IsString()
  photo3?: string;

  @IsOptional()
  @IsString()
  introVideo?: string;

  @IsOptional()
  @IsString()
  socialMediaLinks?: string;

  @IsBoolean()
  understandsPrivateShow: boolean;

  @IsBoolean()
  understandsNoCompensation: boolean;

  @IsBoolean()
  confirmsTruthful: boolean;
}
