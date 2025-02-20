export interface PaginatedRequest {
  nextCursor?: number | null;
  pageSize?: number;
}
export interface GetUserInfoRequest {
  sender: string;
}
