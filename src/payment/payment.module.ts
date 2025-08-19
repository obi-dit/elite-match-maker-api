import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentBackgroundService } from './payment-background.service';
import { PrismaModule } from '../prisma/prisma.module';
import { StripeModule } from '../stripe/stripe.module';

@Module({
  imports: [PrismaModule, StripeModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentBackgroundService],
  exports: [PaymentService],
})
export class PaymentModule {}
