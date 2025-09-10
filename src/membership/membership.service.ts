import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface MembershipTier {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  stripePriceId?: string;
}

@Injectable()
export class MembershipService {
  constructor(private readonly prisma: PrismaService) {}

  // async getAllMembershipTiers(): Promise<MembershipTier[]> {
  //   const tiers = [
  //     { id: 'bronze', name: 'Bronze', price: 19, period: 'month' },
  //     { id: 'silver', name: 'Silver', price: 69, period: 'month' },
  //     { id: 'gold', name: 'Gold', price: 249, period: 'month' },
  //     { id: 'elite-vip', name: 'Elite VIP', price: 1499, period: 'month' },
  //   ];

  //   // Get features for each tier from database
  //   const tiersWithFeatures = await Promise.all(
  //     tiers.map(async (tier) => {
  //       const features = await this.prisma.tierFeature.findMany({
  //         where: {
  //           tierId: tier.id,
  //           isIncluded: true,
  //         },
  //         include: {
  //           feature: true,
  //         },
  //       });

  //       return {
  //         ...tier,
  //         features: features.map((tf) => tf.feature.name),
  //       };
  //     }),
  //   );

  //   return tiersWithFeatures;
  // }

  // async getMembershipTierById(tierId: string): Promise<MembershipTier | null> {
  //   const tiers = await this.getAllMembershipTiers();
  //   return tiers.find((tier) => tier.id === tierId) || null;
  // }

  // async createSubscription(
  //   userId: number,
  //   tierId: string,
  //   stripeCustomerId: string,
  // ): Promise<any> {
  //   // Here you would integrate with Stripe to create a subscription
  //   // For now, we'll just return a mock response
  //   const tier = await this.getMembershipTierById(tierId);

  //   if (!tier) {
  //     throw new Error('Invalid membership tier');
  //   }

  //   // Create subscription record in database
  //   const subscription = await this.prisma.subscription.create({
  //     data: {
  //       userId,
  //       tierId,
  //       stripeCustomerId,
  //       status: 'ACTIVE',
  //       currentPeriodStart: new Date(),
  //       currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  //       price: tier.price,
  //       currency: 'USD',
  //     },
  //   });

  //   return subscription;
  // }

  // async cancelSubscription(subscriptionId: number): Promise<any> {
  //   // Here you would integrate with Stripe to cancel the subscription
  //   const subscription = await this.prisma.subscription.update({
  //     where: { id: subscriptionId },
  //     data: { status: 'CANCELLED' },
  //   });

  //   return subscription;
  // }

  // async getUserSubscription(userId: number): Promise<any> {
  //   return this.prisma.subscription.findFirst({
  //     where: { userId, status: 'ACTIVE' },
  //     include: { user: true },
  //   });
  // }
}
