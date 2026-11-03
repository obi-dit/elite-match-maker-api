import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { UserModule } from './users/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { PaymentModule } from './payment/payment.module';
import { AddOnModule } from './addons/addon.module';
import { MembershipModule } from './membership/membership.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { LikesModule } from './likes/likes.module';
import { AtsModule } from './ats/ats.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    PrismaModule,
    UserModule,
    UploadModule,
    PaymentModule,
    AddOnModule,
    MembershipModule,
    SubscriptionModule,
    AuthModule,
    AdminModule,
    LikesModule,
    AtsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
