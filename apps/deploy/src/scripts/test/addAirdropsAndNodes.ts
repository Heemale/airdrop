import { airdropClient } from '@/sdk';

const addTestAirdropsAndNodes = async () => {
  try {
    const adminCap = "0xADMIN_CAP_ADDRESS"; // 替换为实际的管理员权限地址
    const nodes = "0xNODES_ADDRESS";        // 替换为实际的节点存储地址
    const rank = 1;                         // 节点等级
    const name = "Gold Node";               // 节点名称
    const description = "High-performance node with premium features."; // 节点描述
    const limit = BigInt(100);              // 每人最大购买数量
    const price = BigInt(1_000_000_000);    // 价格 (1 SUI = 10^9 最小单位)
    const total_quantity = BigInt(500);     // 总供应量

    // 调用 insertNode 方法
    const result = await airdropClient.insertNode(
      adminCap,
      nodes,
      rank,
      name,
      description,
      limit,
      price,
      total_quantity
    );

    console.log("Node inserted successfully:", result);
  } catch (error) {
    console.error("Failed to insert node:", error);
  }
    // 获取当前时间
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    // 示例空投数据
    const airdropParams = {
        T: "0x2::coin::CoinType", // 替换为实际的代币类型
        adminCap: "0x6e...", // 管理员权限对象ID
        airdrops: "0x7a...", // 空投集合对象ID
        round: BigInt(1), // 空投轮次，通常从1开始
        startTime: BigInt(Date.now()), // 空投开始时间（毫秒级时间戳）
        endTime: BigInt(Date.now() + 7 * 24 * 60 * 60 * 1000), // 结束时间（+7天）
        totalShares: BigInt(10000), // 总份额
        totalBalance: BigInt(1000000), // 空投总金额，单位可能是最小货币单位
        description: "Test Airdrop for Round 1", // 描述信息
        wallet: "0x3b...", // 管理员钱包地址
        owner: "0x5d..." // 空投的所有者地址
      };
      
      // 使用示例
      await airdropClient.insert(
        airdropParams.T,
        airdropParams.adminCap,
        airdropParams.airdrops,
        airdropParams.round,
        airdropParams.startTime,
        airdropParams.endTime,
        airdropParams.totalShares,
        airdropParams.totalBalance,
        airdropParams.description,
        airdropParams.wallet,
        airdropParams.owner
      );
      
    };
// 调用脚本
addTestAirdropsAndNodes();
