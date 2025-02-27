export interface PaginatedResponse<T> {
  data: Array<T>;
  hasNextPage: boolean;
  nextCursor: number | null;
}

export interface Node {
  description: string;
  name: string;
}
export interface NodeInfoResponse {
  /**
   * 节点号
   */
  rank: number;
  /**
   * 节点名称
   */
  name: string;
  /**
   * 节点描述
   */
  description: string;
  /**
   * 是否开放
   */
  isOpen: boolean;
  /**
   * 领取次数
   */
  limit: number;
  /**
   * 是否移除
   */
  isRemove: boolean;
  /**
   * 节点价格
   */
  price: number;
  /**
   * 总数量
   */
  totalQuantity: number;
  /**
   * 已购买数量
   */
  purchasedQuantity: number;
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
  teamTotalInvestment: number;
  /**
   * 总收益金额
   */
  totalGains: number;
  /**
   * 总投资金额
   */
  totalInvestment: number;
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

export interface UserSharesResponse {
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
  node: Node;
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
export interface AirdropInfo {
  round: bigint;
  startTime: bigint;
  endTime: bigint;
  totalShares: bigint;
  claimedShares: bigint;
  totalBalance: bigint;
  isOpen: boolean;
  description: string;
  image_url: string;
  coinType: string;
  remaining_balance: bigint;
  isRemove: boolean;
}
