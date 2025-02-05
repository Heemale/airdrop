import request from '@/utils/request';

export interface PaginatedResponse<T> {
  data: Array<T>;
  hasNextPage: boolean;
  nextCursor: number | null;
}

export interface UserInfoResponse {
  /**
   * 用户地址
   */
  address: string;
  /**
   * 邀请人地址
   */
  inviter: string;
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
  /**
   * 总收益金额
   */
  totalGains: null | string;
  /**
   * 总投资金额
   */
  totalInvestment: null | string;
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

export interface BuyNodeRecord {
  /**
   * 记录Id
   */
  id: number;
  /**
   * 时间戳
   */
  timestamp: string;
  /**
   * 用户地址
   */
  sender: string;
  /**
   * 权益等级
   */
  rank: string;
  /**
   * 权益编号
   */
  nodeNum: string;
  /**
   * 支付金额
   */
  paymentAmount: string;
}

export interface ClaimAirdropRecord {
  /**
   * 数量, 代币元数据中有精度位，需要转化为大单位。
   */
  amount: null | string;
  /**
   * 代币类型, 前端需要根据代币类型查询代币元数据
   */
  coinType: null | string;
  /**
   * 记录id
   */
  id: number;
  /**
   * 轮次
   */
  round: null | string;
  /**
   * 秒级时间戳
   */
  timestamp: null | string;
}

export const getUserInfo = (params: {
  sender: string;
}): Promise<UserInfoResponse> => request.get('/user/info', { params });

export const getUserShares = (params: {
  sender: string;
  nextCursor?: number | null;
  pageSize?: number;
}): Promise<PaginatedResponse<ShareInfoResponse>> =>
  request.get('/user/shares', { params });

export const getBuyNodeRecord = (params: {
  sender: string;
  nextCursor?: number | null;
  pageSize?: number;
}): Promise<PaginatedResponse<BuyNodeRecord>> =>
  request.get('/buy-node-record', { params });

export const getClaimAirdropRecord = (params: {
  sender: string;
  nextCursor?: number | null;
  pageSize?: number;
}): Promise<PaginatedResponse<ClaimAirdropRecord>> =>
  request.get('/claim-airdrop-record', { params });
