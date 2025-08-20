import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-session')
  @HttpCode(HttpStatus.OK)
  async createPaymentSession(
    @Body() body: { userId: number; packageName?: string },
  ) {
    try {
      const { sessionId, url } = await this.paymentService.createPaymentSession(
        body.userId,
        body.packageName,
      );

      return {
        success: true,
        sessionId,
        url,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const sig = req.headers['stripe-signature'];

    if (!sig) {
      return res.status(400).send('Missing stripe-signature header');
    }

    try {
      const event = await this.paymentService[
        'stripeService'
      ].constructWebhookEvent(req.body, sig as string);

      await this.paymentService.processWebhook(event);

      return res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }

  @Get('transaction/:sessionId')
  async getTransactionBySessionId(@Param('sessionId') sessionId: string) {
    try {
      const transaction =
        await this.paymentService.getTransactionBySessionId(sessionId);

      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }

      return {
        success: true,
        transaction,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('user/:userId/packages')
  async getUserPackages(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const packages = await this.paymentService.getUserPackages(userId);

      return {
        success: true,
        packages,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('packages')
  async getAllPackages() {
    try {
      const packages = await this.paymentService.getAllPackages();

      return {
        success: true,
        packages,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
