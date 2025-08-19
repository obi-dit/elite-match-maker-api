import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async createPaymentSession(
    userId: number,
    packageName: string = 'Bachelor Pilot Show',
  ): Promise<{ sessionId: string; url: string }> {
    try {
      // Get the package
      const packageData = await this.prisma.package.findFirst({
        where: {
          name: packageName,
          isActive: true,
        },
      });

      if (!packageData) {
        throw new BadRequestException('Package not found');
      }

      // Create transaction record
      const transaction = await this.prisma.transaction.create({
        data: {
          userId,
          packageId: packageData.id,
          amount: packageData.price,
          status: 'PENDING',
        },
      });

      // Create Stripe checkout session
      const session = await this.stripeService.createCheckoutSession(
        userId,
        packageData.id,
        packageData.name,
        Number(packageData.price),
        `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        `${process.env.FRONTEND_URL}/payment/cancel`,
      );

      // Update transaction with session ID
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          stripeCheckoutSessionId: session.sessionId,
        },
      });

      return {
        sessionId: session.sessionId,
        url: session.url,
      };
    } catch (error) {
      this.logger.error('Error creating payment session:', error);
      throw error;
    }
  }

  async processWebhook(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          break;
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(
            event.data.object as Stripe.PaymentIntent,
          );
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(
            event.data.object as Stripe.PaymentIntent,
          );
          break;
        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      throw error;
    }
  }

  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<void> {
    const userId = parseInt(session.metadata?.userId || '0');
    const packageId = parseInt(session.metadata?.packageId || '0');

    if (!userId || !packageId) {
      throw new BadRequestException('Invalid session metadata');
    }

    // Update transaction status
    await this.prisma.transaction.updateMany({
      where: {
        userId,
        packageId,
        stripeCheckoutSessionId: session.id,
      },
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
        userId,
        packageId,
        isActive: true,
      },
    });

    this.logger.log(
      `Payment completed for user ${userId}, package ${packageId}`,
    );
  }

  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    // Update transaction status if not already updated
    await this.prisma.transaction.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
      },
      data: {
        status: 'PAID',
        paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
      },
    });

    this.logger.log(`Payment intent succeeded: ${paymentIntent.id}`);
  }

  private async handlePaymentIntentFailed(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    // Update transaction status
    await this.prisma.transaction.updateMany({
      where: {
        stripePaymentIntentId: paymentIntent.id,
      },
      data: {
        status: 'FAILED',
      },
    });

    this.logger.log(`Payment intent failed: ${paymentIntent.id}`);
  }

  async getTransactionBySessionId(sessionId: string) {
    return this.prisma.transaction.findFirst({
      where: {
        stripeCheckoutSessionId: sessionId,
      },
      include: {
        user: true,
        package: true,
      },
    });
  }

  async getUserPackages(userId: number) {
    return this.prisma.userPackage.findMany({
      where: {
        userId,
        isActive: true,
      },
      include: {
        package: true,
      },
    });
  }
}
