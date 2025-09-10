import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MembershipService } from './membership.service';

@Controller('membership')
export class MembershipController {
  constructor(private readonly membershipService: MembershipService) {}

  // @Get('tiers')
  // async getAllMembershipTiers() {
  //   return this.membershipService.getAllMembershipTiers();
  // }

  // @Get('tiers/:id')
  // async getMembershipTierById(@Param('id') id: string) {
  //   return this.membershipService.getMembershipTierById(id);
  // }

  // @Post('subscribe')
  // async createSubscription(
  //   @Body() body: { userId: number; tierId: string; stripeCustomerId: string },
  // ) {
  //   return this.membershipService.createSubscription(
  //     body.userId,
  //     body.tierId,
  //     body.stripeCustomerId,
  //   );
  // }

  // @Delete('subscriptions/:id')
  // async cancelSubscription(@Param('id') id: string) {
  //   return this.membershipService.cancelSubscription(parseInt(id));
  // }

  // @Get('user/:userId/subscription')
  // async getUserSubscription(@Param('userId') userId: string) {
  //   return this.membershipService.getUserSubscription(parseInt(userId));
  // }
}
