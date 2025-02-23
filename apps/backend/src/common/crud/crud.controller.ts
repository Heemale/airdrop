import { Body, Delete, Get, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@/auth/auth.guard';
import { handleCrudRequest } from '@/common/crud/handler';

export abstract class CrudController {
  protected abstract resource: string;

  @Get()
  async getMany(@Query() request: any) {
    return handleCrudRequest(request, this.resource);
  }

  @Get(':id')
  async getOne(@Query() request: any) {
    return handleCrudRequest(request, this.resource);
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() request: any) {
    return handleCrudRequest(request, this.resource);
  }

  @UseGuards(AuthGuard)
  @Put()
  async update(@Body() request: any) {
    return handleCrudRequest(request, this.resource);
  }

  @UseGuards(AuthGuard)
  @Delete()
  async delete(@Body() request: any) {
    return handleCrudRequest(request, this.resource);
  }
}
