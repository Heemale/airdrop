export class GetUserInfoDto {
  sender: string;
}

export class GetSharesDto {
  sender: string;
  nextCursor?: number;
  pageSize?: number;
}
