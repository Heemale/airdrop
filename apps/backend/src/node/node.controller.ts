import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { prisma } from '@/config/prisma';
import { defaultHandler } from 'ra-data-simple-prisma';
import { AuthGuard } from '@/auth/auth.guard';

export const handleBigInt = (result: any) => {
  return JSON.stringify(result, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
};

@Controller('node')
export class NodeController {
  @Get()
  async getMany(@Query() req: any) {
    try {
      const result = await defaultHandler(req, prisma);
      return handleBigInt(result);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getOne(@Query() req: any) {
    try {
      const result = await defaultHandler(req, prisma);
      return handleBigInt(result);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() req: any) {
    const result = await defaultHandler(req, prisma);
    return handleBigInt(result);
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(@Body() req: any) {
    const result = await defaultHandler(req, prisma);
    return handleBigInt(result);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@Body() req: any) {
    const result = await defaultHandler(req, prisma);
    return handleBigInt(result);
  }
}
