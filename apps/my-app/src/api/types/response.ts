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
  totalQuantity:  number;
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
  totalGains:  number;
  /**
   * 总投资金额
   */
  totalInvestment: number;
}
