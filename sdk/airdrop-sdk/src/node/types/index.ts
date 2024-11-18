export interface NodeInfo {
  // 等级
  rank: number;
  // 名称
  name: string;
  // 描述
  description: string;
  // 每轮空投购买次数
  limit: bigint;
  // 价格
  price: bigint;
  // 总量
  total_quantity: bigint;
  // 已购买的数量
  purchased_quantity: bigint;
}
