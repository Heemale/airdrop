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

// 子节点类型（递归结构）
export interface SubordinateNode {
  id: number;
  address: string | null;
  children: SubordinateNode[]; // 递归子节点
}

// 根节点类型
export interface RootNode {
  rootAddresses: string[]; // 根用户的地址数组
  children: SubordinateNode[]; // 根节点的子节点数组
}
