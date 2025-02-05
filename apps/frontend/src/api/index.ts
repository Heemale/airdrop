import request from '@/utils/request';
import {
  GetBuyNodeRecordRequest,
  GetClaimAirdropRecordRequest,
  GetUserInfoRequest,
  GetUserSharesRequest,
} from '@/api/types/request';
import {
  BuyNodeRecord,
  ClaimAirdropRecord,
  PaginatedResponse,
  UserSharesResponse,
  UserInfoResponse,
} from '@/api/types/response';

export const getUserInfo = (
  params: GetUserInfoRequest,
): Promise<UserInfoResponse> => request.get('/user/info', { params });

export const getUserShares = (
  params: GetUserSharesRequest,
): Promise<PaginatedResponse<UserSharesResponse>> =>
  request.get('/user/shares', { params });

export const getBuyNodeRecord = (
  params: GetBuyNodeRecordRequest,
): Promise<PaginatedResponse<BuyNodeRecord>> =>
  request.get('/buy-node-record', { params });

export const getClaimAirdropRecord = (
  params: GetClaimAirdropRecordRequest,
): Promise<PaginatedResponse<ClaimAirdropRecord>> =>
  request.get('/claim-airdrop-record', { params });
