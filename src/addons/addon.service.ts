import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddOnService {
  private readonly logger = new Logger(AddOnService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAllAddOns() {
    return this.prisma.addOn.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        category: 'asc',
      },
    });
  }

  async getAddOnById(id: number) {
    return this.prisma.addOn.findUnique({
      where: { id },
    });
  }

  async getAddOnsByCategory(category: string) {
    return this.prisma.addOn.findMany({
      where: {
        category: category as any,
        isActive: true,
      },
      orderBy: {
        price: 'asc',
      },
    });
  }

  async purchaseAddOn(purchaseData: {
    userId: number;
    addOnId: number;
    quantity?: number;
    notes?: string;
  }) {
    const { userId, addOnId, quantity = 1, notes } = purchaseData;

    // Verify the add-on exists and is active
    const addOn = await this.prisma.addOn.findUnique({
      where: { id: addOnId },
    });

    if (!addOn || !addOn.isActive) {
      throw new BadRequestException('Add-on not found or inactive');
    }

    // Verify the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create the user-add-on relationship
    const userAddOn = await this.prisma.userAddOn.create({
      data: {
        userId,
        addOnId,
        quantity,
        notes,
        isActive: true,
      },
      include: {
        addOn: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    this.logger.log(
      `Add-on purchase created: User ${userId} purchased ${quantity}x ${addOn.name}`,
    );

    return userAddOn;
  }

  async getUserAddOns(userId: number) {
    return this.prisma.userAddOn.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        addOn: true,
      },
      orderBy: {
        purchasedAt: 'desc',
      },
    });
  }

  async getAddOnStats() {
    const totalAddOns = await this.prisma.addOn.count({
      where: { isActive: true },
    });

    const totalPurchases = await this.prisma.userAddOn.count({
      where: { isActive: true },
    });

    const categoryStats = await this.prisma.addOn.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        id: true,
      },
    });

    return {
      totalAddOns,
      totalPurchases,
      categoryStats,
    };
  }
}
