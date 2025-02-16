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
  price: null | string;
  /**
   * 总数量
   */
  totalQuantity: null | string;
  /**
   * 已购买数量
   */
  purchasedQuantity: null | string;
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
