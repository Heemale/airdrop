import { Controller, Get, HttpException, Query } from '@nestjs/common';
import {
	findUserByAddress,
	getAllSubordinates,
	getRootUsers,
} from '@/user/dao/user.dao';
import { GetSharesDto, GetUserInfoDto } from '@/user/dto/getUserInfo.dto';
import { convertSmallToLarge } from '@/utils/math';
import { TOKEN_DECIMAL } from '@/config';

@Controller('user')
export class UserController {
	@Get('info')
	async getUserInfo(@Query() params: GetUserInfoDto) {
		const sender = params.sender && params.sender.toLowerCase();

		if (!sender) {
			throw new HttpException('Invalid parameters', 400);
		}

		const user = await findUserByAddress(sender);
		if (!user) {
			return {
				address: sender,
				inviter: null,
				totalInvestment: null,
				totalGains: null,
				teamTotalInvestment: null,
				shares: 0,
				teams: 0,
			};
		}

		const data = await getAllSubordinates(user.id);
		return {
			address: user.address,
			inviter: user.inviter,
			totalInvestment: user.totalInvestment
				? convertSmallToLarge(user.totalInvestment.toString(), TOKEN_DECIMAL)
				: null,
			totalGains: user.totalGains
				? convertSmallToLarge(user.totalGains.toString(), TOKEN_DECIMAL)
				: null,
			teamTotalInvestment: data.totalInvestmentSum
				? convertSmallToLarge(data.totalInvestmentSum.toString(), TOKEN_DECIMAL)
				: null,
			shares: data.directSubordinates.length,
			teams: data.allSubordinates.length,
		};
	}
	@Get('children')
	async getRchildren() {
		const users = await getRootUsers();
		const children = await Promise.all(
			users.map(async (user) => {
				const data = await getAllSubordinates(user.id);
				return {
					parentAddress: user.address,
					children: data.children, // 返回包含树状结构的子节点
				};
			}),
		);

		// 提取所有根用户的地址
		const rootAddresses = users.map((user) => user.address);

		return {
			rootAddresses, // 返回根用户的地址数组
			children, // 返回每个根用户的子节点
		};
	}

	@Get('shares')
	async getShares(@Query() params: GetSharesDto) {
		const sender = params.sender && params.sender.toLowerCase();
		const nextCursor = params.nextCursor && Number(params.nextCursor);
		const pageSize = params.pageSize ? Number(params.pageSize) : 25;

		if (!sender) {
			throw new HttpException('Invalid sender.', 400);
		}
		if (nextCursor && isNaN(nextCursor)) {
			throw new HttpException('Invalid nextCursor.', 400);
		}
		if (isNaN(pageSize) || pageSize <= 0 || pageSize > 200) {
			throw new HttpException('Page size must be between 1 and 200.', 400);
		}

		const user = await findUserByAddress(sender);
		if (!user || !user.sharerIds) {
			return {
				data: [],
				nextCursor: null,
				hasNextPage: false,
			};
		}

		const ids = user.sharerIds
			.split(',')
			.map(Number)
			.filter((id) => !isNaN(id));
		const startIndex = Math.max(
			nextCursor ? ids.indexOf(nextCursor) + 1 : 0,
			0,
		);
		const paginatedIds = ids.slice(startIndex, startIndex + pageSize);

		const data = await Promise.all(
			paginatedIds.map(async (id) => {
				const data = await getAllSubordinates(id);
				return {
					id: data.id,
					address: data.address,
					teamTotalInvestment: data.totalInvestmentSum
						? convertSmallToLarge(
								data.totalInvestmentSum.toString(),
								TOKEN_DECIMAL,
							)
						: null,
					shares: data.directSubordinates.length,
					teams: data.allSubordinates.length,
				};
			}),
		);

		const hasNextPage = data.length === pageSize;
		const cursor = hasNextPage ? data[data.length - 1].id : null;

		return {
			data,
			nextCursor: cursor,
			hasNextPage,
		};
	}
}
