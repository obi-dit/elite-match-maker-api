import { City, EnglishProficiency, Children, GENDER } from '@prisma/client';

export class UserResponseDto {
  id: number;
  fullName?: string;
  age: number;
  email?: string;
  whatsappNumber?: string;
  gender?: GENDER;
  cityOfResidence?: City;
  cityOther?: string;
  englishProficiency?: EnglishProficiency;
  heightCm: number;
  weightKg: number;
  isSingleAndAvailable?: boolean;
  comfortableFilming?: boolean;
  traditionalWantsMarriage?: boolean;
  willingToCompete?: boolean;
  children?: Children;
  willingLieDetector?: boolean;
  consentForMedia?: boolean;
  personalityThreeWords?: string;
  relationshipGoals?: string;
  attractionToOlderMen?: string;
  whyGoodWife?: string;
  talentsOrHobbies?: string;
  comfortableBikiniChallenges: boolean;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  introVideo?: string;
  socialMediaLinks?: string;
  understandsPrivateShow: boolean;
  understandsNoCompensation: boolean;
  confirmsTruthful: boolean;
  createdAt: Date;
  updatedAt: Date;
}
