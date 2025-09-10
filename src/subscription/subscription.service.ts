import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async getSubscriptions() {
    return this.prisma.subscription.findMany({
      include: {
        subscriptionFeatures: {
          include: {
            feature: true,
          },
        },
      },
    });
  }

  async getSubscriptionById(id: number) {
    return this.prisma.subscription.findUnique({
      where: { id },
      include: {
        subscriptionFeatures: {
          include: {
            feature: true,
          },
        },
      },
    });
  }
}
