import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  async getSubscriptions() {
    return this.subscriptionService.getSubscriptions();
  }

  @Get(':id')
  async getSubscriptionById(@Param('id', ParseIntPipe) id: number) {
    console.log('id', id);
    return this.subscriptionService.getSubscriptionById(id);
  }
}
