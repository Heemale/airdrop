import request from '@/utils/request';
import { PaginatedRequest } from '@/api/types/request';
import {
  BuyNodeRecord,
  ClaimAirdropRecord,
  PaginatedResponse,
  UserSharesResponse,
  UserInfoResponse,
} from '@/api/types/response';

export const getUserInfo = (address: string): Promise<UserInfoResponse> =>
  request.get(`/users/address/${address}/info`);

export const getUserShares = (
  address: string,
  params: PaginatedRequest,
): Promise<PaginatedResponse<UserSharesResponse>> =>
  request.get(`/users/address/${address}/shares`, { params });

export const getBuyRecords = (
  address: string,
  params: PaginatedRequest,
): Promise<PaginatedResponse<BuyNodeRecord>> =>
  request.get(`/buy-records/address/${address}`, { params });

export const getClaimRecords = (
  address: string,
  params: PaginatedRequest,
): Promise<PaginatedResponse<ClaimAirdropRecord>> =>
  request.get(`/claim-records/address/${address}`, { params });
