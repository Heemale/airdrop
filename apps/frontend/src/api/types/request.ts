export interface PaginatedRequest {
  nextCursor?: number | null;
  pageSize?: number;
}

export interface GetUserInfoRequest {
  sender: string;
}

export interface GetUserSharesRequest extends PaginatedRequest {
  sender: string;
}

export interface GetBuyNodeRecordRequest extends PaginatedRequest {
  sender: string;
}

export interface GetClaimAirdropRecordRequest extends PaginatedRequest {
  sender: string;
}
