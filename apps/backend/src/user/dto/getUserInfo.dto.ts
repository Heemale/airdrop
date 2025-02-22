export class GetUserInfoDto {
	sender: string;
}

export class GetSharesDto {
	sender: string;
	nextCursor?: number;
	pageSize?: number;
}
export class RootUserResponse {
	id: number;
	address: string;
	shareIds: number[]; // 直接下级ID列表
	isRoot: boolean;
}
