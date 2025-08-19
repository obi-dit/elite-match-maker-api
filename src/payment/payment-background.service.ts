import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';

@Injectable()
export class PaymentBackgroundService {
  private readonly logger = new Logger(PaymentBackgroundService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async updatePendingTransactions() {
    this.logger.log('Checking for pending transactions...');

    try {
      // Get all pending transactions
      const pendingTransactions = await this.prisma.transaction.findMany({
        where: {
          status: 'PENDING',
          stripeCheckoutSessionId: {
            not: null,
          },
        },
        include: {
          user: true,
          package: true,
        },
      });

      for (const transaction of pendingTransactions) {
        try {
          // Retrieve session from Stripe
          const session = await this.stripeService.retrieveSession(
            transaction.stripeCheckoutSessionId!,
          );

          // Update transaction status based on session status
          if (session.payment_status === 'paid') {
            await this.prisma.transaction.update({
              where: { id: transaction.id },
              data: {
                status: 'PAID',
                stripePaymentIntentId: session.payment_intent as string,
                paymentMethod: session.payment_method_types?.[0] || 'card',
                metadata: {
                  customerEmail: session.customer_details?.email,
                  customerName: session.customer_details?.name,
                },
              },
            });

            // Create user package relationship
            await this.prisma.userPackage.create({
              data: {
                userId: transaction.userId,
                packageId: transaction.packageId,
                isActive: true,
              },
            });

            this.logger.log(
              `Transaction ${transaction.id} marked as PAID for user ${transaction.userId}`,
            );
          } else if (
            session.payment_status === 'unpaid' &&
            session.status === 'expired'
          ) {
            await this.prisma.transaction.update({
              where: { id: transaction.id },
              data: {
                status: 'CANCELLED',
              },
            });

            this.logger.log(
              `Transaction ${transaction.id} marked as CANCELLED for user ${transaction.userId}`,
            );
          }
        } catch (error) {
          this.logger.error(
            `Error processing transaction ${transaction.id}:`,
            error,
          );
        }
      }
    } catch (error) {
      this.logger.error('Error in updatePendingTransactions:', error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupExpiredSessions() {
    this.logger.log('Cleaning up expired payment sessions...');

    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      // Update expired pending transactions
      await this.prisma.transaction.updateMany({
        where: {
          status: 'PENDING',
          createdAt: {
            lt: oneDayAgo,
          },
        },
        data: {
          status: 'CANCELLED',
        },
      });

      this.logger.log('Expired sessions cleaned up');
    } catch (error) {
      this.logger.error('Error in cleanupExpiredSessions:', error);
    }
  }

  async getTransactionStats() {
    try {
      const stats = await this.prisma.transaction.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
        _sum: {
          amount: true,
        },
      });

      return stats;
    } catch (error) {
      this.logger.error('Error getting transaction stats:', error);
      return [];
    }
  }
}
