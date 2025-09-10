import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateMembershipUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  selectedTier: string;

  @IsOptional()
  @IsString()
  stripeCustomerId?: string;
}
