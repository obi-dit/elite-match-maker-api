import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMaleUserDto } from './dto/create-male-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { City } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      // Validate email uniqueness if provided
      if (createUserDto.email) {
        const existingUser = await this.prisma.user.findUnique({
          where: { email: createUserDto.email },
        });
        if (existingUser) {
          throw new ConflictException('Email already exists');
        }
      }

      // Validate age range
      if (createUserDto.age < 28 || createUserDto.age > 32) {
        throw new BadRequestException('Age must be between 28 and 32');
      }

      // Validate height range
      if (createUserDto.heightCm < 100 || createUserDto.heightCm > 250) {
        throw new BadRequestException('Height must be between 100 and 250 cm');
      }

      // Validate weight range
      if (createUserDto.weightKg < 30 || createUserDto.weightKg > 200) {
        throw new BadRequestException('Weight must be between 30 and 200 kg');
      }

      // Validate cityOther is provided when cityOfResidence is OTHER
      if (
        createUserDto.cityOfResidence === 'OTHER' &&
        !createUserDto.cityOther
      ) {
        throw new BadRequestException(
          'cityOther is required when cityOfResidence is OTHER',
        );
      }

      const user = await this.prisma.user.create({
        data: createUserDto,
      });

      const userResponse = user as UserResponseDto;

      return userResponse;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error creating user:', error);
      throw new BadRequestException('Failed to create user');
    }
  }

  async createMaleUser(
    createMaleUserDto: CreateMaleUserDto,
  ): Promise<UserResponseDto> {
    try {
      // Validate email uniqueness if provided
      if (createMaleUserDto.email) {
        const existingUser = await this.prisma.user.findUnique({
          where: { email: createMaleUserDto.email },
        });
        if (existingUser) {
          throw new ConflictException('Email already exists');
        }
      }

      // Validate age range for males
      if (createMaleUserDto.age < 35 || createMaleUserDto.age > 60) {
        throw new BadRequestException('Age must be between 35 and 60');
      }

      // Validate height range if provided
      if (
        createMaleUserDto.heightCm &&
        (createMaleUserDto.heightCm < 150 || createMaleUserDto.heightCm > 220)
      ) {
        throw new BadRequestException('Height must be between 150 and 220 cm');
      }

      // Validate weight range if provided
      if (
        createMaleUserDto.weightKg &&
        (createMaleUserDto.weightKg < 50 || createMaleUserDto.weightKg > 150)
      ) {
        throw new BadRequestException('Weight must be between 50 and 150 kg');
      }

      // Validate cityOther is provided when cityOfResidence is OTHER
      if (
        createMaleUserDto.cityOfResidence === 'OTHER' &&
        !createMaleUserDto.cityOther
      ) {
        throw new BadRequestException(
          'cityOther is required when cityOfResidence is OTHER',
        );
      }

      // Transform male user data to match database schema
      const userData = {
        fullName: createMaleUserDto.fullName,
        age: createMaleUserDto.age,
        email: createMaleUserDto.email,
        whatsappNumber: createMaleUserDto.phoneNumber,
        gender: createMaleUserDto.gender || 'MALE',
        cityOfResidence: createMaleUserDto.cityOfResidence as any,
        cityOther: createMaleUserDto.cityOther,
        englishProficiency: undefined,
        heightCm: createMaleUserDto.heightCm || 0,
        weightKg: createMaleUserDto.weightKg || 0,
        isSingleAndAvailable: undefined,
        comfortableFilming: undefined,
        traditionalWantsMarriage: undefined,
        willingToCompete: undefined,
        children: undefined,
        willingLieDetector: undefined,
        consentForMedia: undefined,
        personalityThreeWords: undefined,
        relationshipGoals: undefined,
        attractionToOlderMen: undefined,
        whyGoodWife: undefined,
        talentsOrHobbies: undefined,
        comfortableBikiniChallenges: false, // Default for males
        photo1: createMaleUserDto.photo1,
        photo2: createMaleUserDto.photo2,
        photo3: createMaleUserDto.photo3,
        introVideo: createMaleUserDto.introVideo,
        socialMediaLinks: createMaleUserDto.socialMediaLinks,
        understandsPrivateShow: createMaleUserDto.understandsPrivateShow,
        understandsNoCompensation: createMaleUserDto.understandsNoCompensation,
        confirmsTruthful: createMaleUserDto.confirmsTruthful,
      };

      // Convert string city values to enum values
      if (userData.cityOfResidence) {
        const cityMap: { [key: string]: City } = {
          NEW_YORK: City.NEW_YORK,
          LOS_ANGELES: City.LOS_ANGELES,
          CHICAGO: City.CHICAGO,
          HOUSTON: City.HOUSTON,
          PHOENIX: City.PHOENIX,
          PHILADELPHIA: City.PHILADELPHIA,
          SAN_ANTONIO: City.SAN_ANTONIO,
          SAN_DIEGO: City.SAN_DIEGO,
          DALLAS: City.DALLAS,
          SAN_JOSE: City.SAN_JOSE,
          BARRANQUILLA: City.BARRANQUILLA,
          SANTA_MARTA: City.SANTA_MARTA,
          CARTAGENA: City.CARTAGENA,
          MEDELLIN: City.MEDELLIN,
          BOGOTA: City.BOGOTA,
          OTHER: City.OTHER,
        };
        userData.cityOfResidence =
          cityMap[userData.cityOfResidence] || City.OTHER;
      }

      const user = await this.prisma.user.create({
        data: userData,
      });

      // Create payment session for male users
      let paymentSession = null;
      try {
        paymentSession = await this.paymentService.createPaymentSession(
          user.id,
          'Bachelor Pilot Show',
        );
      } catch (error) {
        console.error('Error creating payment session:', error);
        // Don't fail user creation if payment session creation fails
      }

      const userResponse = user as UserResponseDto;

      // Add payment session to response if available
      if (paymentSession) {
        (userResponse as any).paymentSession = paymentSession;
      }

      return userResponse;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error creating male user:', error);
      throw new BadRequestException('Failed to create user');
    }
  }

  async updateUserPhotos(
    userId: number,
    photoUrls: { photo1?: string; photo2?: string; photo3?: string },
  ): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: photoUrls,
      });
      return user as UserResponseDto;
    } catch (error) {
      throw new BadRequestException('Failed to update user photos');
    }
  }

  async updateUserVideo(
    userId: number,
    videoUrl: string,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { introVideo: videoUrl },
      });
      return user as UserResponseDto;
    } catch (error) {
      throw new BadRequestException('Failed to update user video');
    }
  }

  async findAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users as UserResponseDto[];
  }

  async findUserById(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user as UserResponseDto;
  }
}
