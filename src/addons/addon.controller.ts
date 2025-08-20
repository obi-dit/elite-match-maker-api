import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AddOnService } from './addon.service';

@Controller('addons')
export class AddOnController {
  constructor(private readonly addOnService: AddOnService) {}

  @Get()
  async getAllAddOns() {
    try {
      const addOns = await this.addOnService.getAllAddOns();

      return {
        success: true,
        addons: addOns,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async getAddOnById(@Param('id', ParseIntPipe) id: number) {
    try {
      const addOn = await this.addOnService.getAddOnById(id);

      if (!addOn) {
        throw new BadRequestException('Add-on not found');
      }

      return {
        success: true,
        addon: addOn,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('category/:category')
  async getAddOnsByCategory(@Param('category') category: string) {
    try {
      const addOns = await this.addOnService.getAddOnsByCategory(category);

      return {
        success: true,
        addons: addOns,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('purchase')
  @HttpCode(HttpStatus.CREATED)
  async purchaseAddOn(
    @Body()
    purchaseData: {
      userId: number;
      addOnId: number;
      quantity?: number;
      notes?: string;
    },
  ) {
    try {
      const purchase = await this.addOnService.purchaseAddOn(purchaseData);

      return {
        success: true,
        purchase,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('user/:userId')
  async getUserAddOns(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const userAddOns = await this.addOnService.getUserAddOns(userId);

      return {
        success: true,
        userAddOns,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
