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
} from '@nestjs/common';
import { prisma } from '@/config/prisma';
import { defaultHandler } from 'ra-data-simple-prisma';

@Controller('nodes')
export class NodeController {
	@Get()
	async getMany(@Query() req: Request) {
		try {
			const body = await req.json();
			return await defaultHandler(body, prisma);
		} catch (err) {
			throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Get(':id')
	async getOne(@Query() req: Request) {
		try {
			const body = await req.json();
			return await defaultHandler(body, prisma);
		} catch (err) {
			throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Post()
	async create(@Body() req: Request) {
		const body = await req.json();
		return await defaultHandler(body, prisma);
	}

	@Put()
	async update(@Body() req: Request) {
		const body = await req.json();
		return await defaultHandler(body, prisma);
	}

	@Delete()
	async delete(@Body() req: Request) {
		const body = await req.json();
		return await defaultHandler(body, prisma);
	}
}
