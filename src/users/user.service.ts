import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { AddOnService } from '../addons/addon.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateMaleUserDto } from './dto/create-male-user.dto';
import { CreateMembershipUserDto } from './dto/create-membership-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { City, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CLIENT_CREATED, ClientCreatedEvent } from '../ats/ats-sync.events';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentService: PaymentService,
    private readonly addOnService: AddOnService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private emitClientCreated(user: User) {
    const event: ClientCreatedEvent = {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      phone: user.whatsappNumber,
      gender: user.gender,
    };
    this.eventEmitter.emit(CLIENT_CREATED, event);
  }

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
      this.emitClientCreated(user);

      const userResponse = user as UserResponseDto;

      let paymentSession = null;
      try {
        paymentSession =
          await this.paymentService.createApplicationFeePaymentSession(user.id);
      } catch (error) {
        console.error('Error creating application fee payment session:', error);
        throw error;
      }

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
        password: createMaleUserDto.password ?? null,
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

      // set default password
      if (!createMaleUserDto.password) {
        const defaultPassword = process.env.DEFAULT_PASSWORD;
        const hashedPassword = await argon2.hash(defaultPassword);
        userData.password = hashedPassword;
      }

      const user = await this.prisma.user.create({
        data: userData,
      });
      this.emitClientCreated(user);

      let paymentSession = null;
      try {
        paymentSession =
          await this.paymentService.createApplicationFeePaymentSession(user.id);
      } catch (error) {
        console.error('Error creating application fee payment session:', error);
        throw error;
      }

      const userResponse = user as UserResponseDto;

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

  // async findUserById(id: number): Promise<UserResponseDto> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { id },
  //   });
  //   if (!user) {
  //     throw new BadRequestException('User not found');
  //   }
  //   return user as UserResponseDto;
  // }

  async createMembershipUser(
    createMembershipUserDto: CreateMembershipUserDto,
  ): Promise<UserResponseDto> {
    try {
      // Validate email uniqueness
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createMembershipUserDto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Hash password before storing
      const hashedPassword = await argon2.hash(
        createMembershipUserDto.password,
      );

      // Create user with membership information
      const user = await this.prisma.user.create({
        data: {
          firstName: createMembershipUserDto.firstName,
          lastName: createMembershipUserDto.lastName,
          email: createMembershipUserDto.email,
          password: hashedPassword,
          gender: 'MALE', // Default for membership users
          selectedTier: createMembershipUserDto.selectedTier,
          comfortableBikiniChallenges: true,
          understandsPrivateShow: true,
          understandsNoCompensation: true,
          confirmsTruthful: true,
        },
      });
      this.emitClientCreated(user);

      // Create payment session for membership users
      let paymentSession = null;

      paymentSession = await this.paymentService.createMembershipPaymentSession(
        user.id,
        Number(createMembershipUserDto.selectedTier),
      );

      return { ...paymentSession };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error creating membership user:', error);
      throw new BadRequestException('Failed to create membership user');
    }
  }

  async findApplicants(): Promise<Array<Partial<User>>> {
    try {
      const applicants = await this.prisma.user.findMany({
        where: {
          isMembershipSubscribed: false, // Only non-membership users (applicants)
          gender: 'FEMALE',
        },
        select: {
          id: true,
          fullName: true,
          firstName: true,
          lastName: true,
          age: true,
          photo1: true,
          photo2: true,
          photo3: true,
          cityOfResidence: true,
          englishProficiency: true,
          heightCm: true,
          weightKg: true,
          personalityThreeWords: true,
          relationshipGoals: true,
          talentsOrHobbies: true,
          whyGoodWife: true,
          attractionToOlderMen: true,
          comfortableFilming: true,
          traditionalWantsMarriage: true,
          willingToCompete: true,
          children: true,
          willingLieDetector: true,
          consentForMedia: true,
          comfortableBikiniChallenges: true,
          introVideo: true,
          socialMediaLinks: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return applicants.map(
        (applicant) =>
          ({
            id: applicant.id,
            fullName: applicant.fullName,
            firstName: applicant.firstName,
            lastName: applicant.lastName,
            age: applicant.age,
            photo1: applicant.photo1,
            photo2: applicant.photo2,
            photo3: applicant.photo3,
            cityOfResidence: applicant.cityOfResidence,
            englishProficiency: applicant.englishProficiency,
            heightCm: applicant.heightCm,
            weightKg: applicant.weightKg,
            personalityThreeWords: applicant.personalityThreeWords,
            relationshipGoals: applicant.relationshipGoals,
            talentsOrHobbies: applicant.talentsOrHobbies,
            whyGoodWife: applicant.whyGoodWife,
            attractionToOlderMen: applicant.attractionToOlderMen,
            comfortableFilming: applicant.comfortableFilming,
            traditionalWantsMarriage: applicant.traditionalWantsMarriage,
            willingToCompete: applicant.willingToCompete,
            children: applicant.children,
            willingLieDetector: applicant.willingLieDetector,
            consentForMedia: applicant.consentForMedia,
            comfortableBikiniChallenges: applicant.comfortableBikiniChallenges,
            introVideo: applicant.introVideo,
            socialMediaLinks: applicant.socialMediaLinks,
            createdAt: applicant.createdAt,
            updatedAt: applicant.updatedAt,
          }) as Partial<User>,
      );
    } catch (error) {
      console.error('Error fetching applicants:', error);
      throw new BadRequestException('Failed to fetch applicants');
    }
  }
}
