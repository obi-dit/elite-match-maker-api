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

export class CreateMaleUserDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsNumber()
  @Min(35)
  @Max(60)
  age: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER;

  @IsOptional()
  @IsString()
  cityOfResidence?: string;

  @IsOptional()
  @IsString()
  cityOther?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  annualIncome?: string;

  @IsOptional()
  @IsString()
  educationLevel?: string;

  @IsOptional()
  @IsString()
  maritalStatus?: string;

  @IsOptional()
  @IsString()
  hasChildren?: string;

  @IsOptional()
  @IsString()
  childrenAges?: string;

  @IsOptional()
  @IsNumber()
  @Min(150)
  @Max(220)
  heightCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(50)
  @Max(150)
  weightKg?: number;

  @IsOptional()
  @IsString()
  healthStatus?: string;

  @IsOptional()
  @IsString()
  lifestyleHabits?: string;

  @IsOptional()
  @IsString()
  relationshipHistory?: string;

  @IsOptional()
  @IsString()
  whatLookingFor?: string;

  @IsOptional()
  @IsString()
  dealBreakers?: string;

  @IsOptional()
  @IsString()
  hobbiesInterests?: string;

  @IsOptional()
  @IsString()
  travelPreferences?: string;

  @IsOptional()
  @IsString()
  languageSkills?: string;

  @IsOptional()
  @IsString()
  culturalBackground?: string;

  @IsOptional()
  @IsString()
  financialStability?: string;

  @IsOptional()
  @IsString()
  futurePlans?: string;

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

  @IsOptional()
  @IsBoolean()
  willingToPay?: boolean;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}
