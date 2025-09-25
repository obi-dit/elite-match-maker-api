import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import Stripe from 'stripe';
import { TransactionStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
  ) {}

  async createMembershipPaymentSession(
    userId: number,
    subscriptionTierId: number,
  ): Promise<{ sessionId: string; url: string }> {
    try {
      // Get the subscription tier
      const subscriptionTier = await this.prisma.subscription.findFirst({
        where: {
          id: subscriptionTierId,
          isActive: true,
        },
      });

      if (!subscriptionTier) {
        throw new BadRequestException('Subscription tier not found');
      }

      const totalPrice = subscriptionTier.price;
      // Create transaction record
      const transaction = await this.prisma.transaction.create({
        data: {
          userId,
          subscriptionId: subscriptionTier.id,
          amount: totalPrice,
          status: 'PENDING',
        },
      });
      const session = await this.stripeService.createCheckoutSession(
        userId,
        subscriptionTier.id,
        subscriptionTier.tier,
        Number(totalPrice),
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
      this.logger.error('Error creating membership payment session:', error);
      throw error;
    }
  }

  async createPaymentSession(
    userId: number,
    packageName: string = 'Bachelor Pilot Show',
    addOns: number[] = [],
  ): Promise<{ sessionId: string; url: string }> {
    try {
      // Get the package
      const packageData = await this.prisma.package.findFirst({
        where: {
          name: packageName,
          isActive: true,
        },
      });

      // Get the add-ons
      const addOnsData = await this.prisma.addOn.findMany({
        where: {
          id: { in: addOns },
        },
      });

      // Validate that all requested add-ons were found
      if (addOns.length > 0 && addOnsData.length !== addOns.length) {
        const foundIds = addOnsData.map((addOn) => addOn.id);
        const missingIds = addOns.filter((id) => !foundIds.includes(id));
        throw new BadRequestException(
          `Add-ons not found: ${missingIds.join(', ')}`,
        );
      }

      // Calculate total price including add-ons
      const totalPrice =
        Number(packageData.price) +
        addOnsData.reduce((sum, addOn) => sum + Number(addOn.price), 0);

      if (!packageData) {
        throw new BadRequestException('Package not found');
      }

      // Create transaction record
      const transactionData: any = {
        userId,
        packageId: packageData.id,
        amount: totalPrice,
        status: 'PENDING',
      };

      // Only add transactionAddOns if there are add-ons
      if (addOnsData.length > 0) {
        transactionData.transactionAddOns = {
          create: addOnsData.map((addOn) => ({
            addOn: {
              connect: {
                id: addOn.id,
              },
            },
            quantity: 1,
            totalPrice: addOn.price ?? 0,
            unitPrice: addOn.price ?? 0,
          })),
        };
        console.log('trabsactionData with add-ons', transactionData);
      } else {
        console.log('Creating transaction without add-ons');
      }

      const transaction = await this.prisma.transaction.create({
        data: transactionData,
      });

      // Create Stripe checkout session
      const session = await this.stripeService.createCheckoutSession(
        userId,
        packageData.id,
        packageData.name,
        Number(totalPrice),
        `${process.env.FRONTEND_URL}/onboarding/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
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
    let userSubscription = null;
    let userPackage = null;
    const session = await this.stripeService.retrieveSession(sessionId);
    console.log(session);
    const transaction = await this.prisma.transaction.findFirst({
      where: {
        stripeCheckoutSessionId: sessionId,
      },
      include: {
        user: true,
        package: true,
        subscription: true,
      },
    });
    if (
      session.payment_status === 'paid' &&
      transaction.status === TransactionStatus.PENDING
    ) {
      if (transaction.packageId) {
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

        // Create user subscription relationship

        //Get the subscription from the subscription
        const defaultSubscription = 'ELITEVIP';
        const subscription = await this.prisma.subscription.findUnique({
          where: {
            tier: defaultSubscription,
          },
        });

        if (!subscription) {
          this.logger.error(`Subscription ${defaultSubscription} not found`);
          throw new BadRequestException(
            `Subscription ${defaultSubscription} not found`,
          );
        }

        await this.prisma.userSubscription.create({
          data: {
            user: {
              connect: {
                id: Number(transaction.userId),
              },
            },

            subscription: {
              connect: {
                id: Number(subscription.id),
              },
            },
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(
              new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
            ),

            price: transaction.amount,
            status: 'ACTIVE',
            stripeCustomerId: 'stripe' as string,
          },
        });
        await this.prisma.user.update({
          where: { id: transaction.userId },
          data: {
            isMembershipSubscribed: true,
          },
        });
        this.logger.log(
          `Transaction ${transaction.id} marked as PAID for user ${transaction.userId}`,
        );
      }

      if (transaction.subscriptionId) {
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
        await this.prisma.userSubscription.create({
          data: {
            user: {
              connect: {
                id: Number(transaction.userId),
              },
            },

            subscription: {
              connect: {
                id: Number(transaction.subscriptionId),
              },
            },
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(
              new Date().getTime() + 30 * 24 * 60 * 60 * 1000,
            ),

            price: transaction.amount,
            status: 'ACTIVE',
            stripeCustomerId: 'stripe' as string,
          },
        });

        await this.prisma.user.update({
          where: { id: transaction.userId },
          data: {
            isMembershipSubscribed: true,
          },
        });

        this.logger.log(
          `Transaction ${transaction.id} marked as PAID for user ${transaction.userId} and user is now subscribed`,
        );
      }
    }
    if (transaction.subscriptionId) {
      userSubscription = await this.prisma.userSubscription.findFirst({
        where: {
          userId: transaction.userId,
          subscriptionId: transaction.subscriptionId,
        },
      });
    }
    if (transaction.packageId) {
      userPackage = await this.prisma.userPackage.findFirst({
        where: {
          userId: transaction.userId,
          packageId: transaction.packageId,
        },
        include: {
          package: true,
        },
      });
    }
    return {
      ...transaction,
      userSubscription: userSubscription
        ? {
            ...userSubscription,
          }
        : null,
      userPackage: userPackage
        ? {
            ...userPackage,
            name: userPackage.package.name,
          }
        : null,
      paymentStatus: session.payment_status,
    };
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

  async getAllPackages() {
    return this.prisma.package.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: 'asc',
      },
    });
  }
}
