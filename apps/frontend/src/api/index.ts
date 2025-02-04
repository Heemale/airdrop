import request from '@/utils/request';
import { AxiosResponse } from 'axios';

export interface UserInfoResponse {
  address: string;
  /** 分享人数 */
  shares: number;
  /** 团队人数 */
  teams: number;
  /** 团队总投资金额 */
  teamTotalInvestment: string | null;
  /** 总收益金额 */
  totalGains: string | null;
  /** 总投资金额 */
  totalInvestment: string | null;
  nextCursor: number;
}

export interface ShareInfoResponse {
  /**
   * 用户地址
   */
  address: string;
  /**
   * 用户id
   */
  id: number;
  /**
   * 分享人数
   */
  shares: number;
  /**
   * 团队人数
   */
  teams: number;
  /**
   * 团队总投资金额
   */
  teamTotalInvestment: null | string;
}

export interface SharesResponse {
  data: ShareInfoResponse[];
  nextCursor: number | null;
  hasNextPage: boolean;
}

export const getUserInfo = (params: {
  sender: string;
}): Promise<UserInfoResponse> => request.get('/user/info', { params });

export const getUserShares = (params: {
  sender: string;
  nextCursor?: number | null;
  pageSize?: number;
}): Promise<SharesResponse> => request.get('/user/shares', { params });

export const getBuyNodeRecord = (params: {
  sender: string;
  nextCursor?: number | null;
  pageSize?: number;
}) => request.get('/buy-node-record', { params });

export const getClaimAirdropRecord = (params: {
  sender: string;
  nextCursor?: number | null;
  pageSize?: number;
}) => request.get('/claim-airdrop-record', { params });
