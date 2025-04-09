import request from '@/utils/request';
import { PaginatedRequest } from '@/api/types/request';
import {
  BuyNodeRecord,
  ClaimAirdropRecord,
  PaginatedResponse,
  UserSharesResponse,
  UserInfoResponse,
  NodeInfoResponse,
  AirdropInfo,
  MediaConfigRecord,
} from '@/api/types/response';

export const getUserInfo = (address: string): Promise<UserInfoResponse> =>
  request.get(`/api/users/address/${address}/info`);

export const getUserShares = (
  address: string,
  params: PaginatedRequest,
): Promise<PaginatedResponse<UserSharesResponse>> =>
  request.get(`/api/users/address/${address}/shares`, { params });

export const getBuyRecords = (
  address: string,
  params: PaginatedRequest,
): Promise<PaginatedResponse<BuyNodeRecord>> =>
  request.get(`/api/buy-records/address/${address}`, { params });

export const getClaimRecords = (
  address: string,
  params: PaginatedRequest,
): Promise<PaginatedResponse<ClaimAirdropRecord>> =>
  request.get(`/api/claim-records/address/${address}`, { params });

export const getNodeInfo = (): Promise<NodeInfoResponse> =>
  request.get('/api/nodes/all-nodes');

export const getAirdropInfo = (
  params: PaginatedRequest,
): Promise<PaginatedResponse<AirdropInfo>> =>
  request.get('/api/airdrops/all-airdrops', { params });

export const getMediaConfig = (page: string): Promise<MediaConfigRecord> =>
  request.get(`/api/media-configs/pages/${page}`);
