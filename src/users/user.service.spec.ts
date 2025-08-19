import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        age: 30,
        heightCm: 165,
        weightKg: 60,
        comfortableBikiniChallenges: true,
        understandsPrivateShow: true,
        understandsNoCompensation: true,
        confirmsTruthful: true,
        fullName: 'Test User',
        email: 'test@example.com',
      };

      const expectedUser = {
        id: 1,
        ...createUserDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        age: 30,
        heightCm: 165,
        weightKg: 60,
        comfortableBikiniChallenges: true,
        understandsPrivateShow: true,
        understandsNoCompensation: true,
        confirmsTruthful: true,
        email: 'existing@example.com',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 1 });

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
    });

    it('should throw BadRequestException if age is out of range', async () => {
      const createUserDto: CreateUserDto = {
        age: 25, // Invalid age
        heightCm: 165,
        weightKg: 60,
        comfortableBikiniChallenges: true,
        understandsPrivateShow: true,
        understandsNoCompensation: true,
        confirmsTruthful: true,
      };

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        'Age must be between 28 and 32',
      );
    });
  });
});
