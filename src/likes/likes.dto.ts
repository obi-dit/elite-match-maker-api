import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikesDto {
  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @IsNotEmpty()
  @IsNumber()
  applicantId: number;
}
