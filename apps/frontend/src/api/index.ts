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
}

export const getUserInfo = (params: {
  sender: string;
}): Promise<UserInfoResponse> => request.get('/user/info', { params });

export const getUserShares = (params: {
  sender: string;
  nextCursor?: number;
}) => request.get('/user/shares', { params });

export const getBuyNodeRecord = (params: {
  sender: string;
  nextCursor?: number;
}) => request.get('/buy-node-record', { params });

export const getClaimAirdropRecord = (params: {
  sender: string;
  nextCursor?: number;
  pageSize?: number;
}) => request.get('/claim-airdrop-record', { params });
