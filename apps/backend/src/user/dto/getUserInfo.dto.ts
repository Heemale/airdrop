export class GetUserInfoDto {
  address: string;
}

export class GetSharesDto {
  sender: string;
  nextCursor?: number;
  pageSize: number;
}
