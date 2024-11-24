'use client';

import React, { useEffect, useState } from 'react';
import { AIRDROPS } from '@local/airdrop-sdk/utils';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';
import { Button, Table, message } from 'antd';
import { airdropClient } from '@/sdk';
import { ADMIN_CAP } from '@local/airdrop-sdk/utils';

const AdminPage = () => {
  const [airdropList, setAirdropList] = useState<AirdropInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  // 获取空投列表
  const fetchAirdropList = async () => {
    try {
      setLoading(true);
      const list = await airdropClient.airdrops(AIRDROPS);
      setAirdropList(list);
    } catch (error) {
      messageApi.error('获取空投列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 提款功能
  const handleWithdraw = async (round: bigint, coinType: string) => {
    try {
      setLoading(true);
      
      const result = await airdropClient.withdraw(coinType, ADMIN_CAP, AIRDROPS, round);
      console.log("Withdraw transaction result:", result); // 打印结果
      messageApi.success('提款成功');
      fetchAirdropList(); // 更新空投列表
    } catch (error) {
      messageApi.error('提款失败');
      console.error("Withdraw error:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchAirdropList(); // 页面加载时获取空投列表
  }, []);

  // 表格列配置
  const columns = [
    { title: '轮次', dataIndex: 'round', key: 'round' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
    { title: '总份数', dataIndex: 'totalShares', key: 'totalShares' },
    { title: '已领取份数', dataIndex: 'claimedShares', key: 'claimedShares' },
    { title: '总余额', dataIndex: 'totalBalance', key: 'totalBalance' },
    {
      title: '是否开启',
      dataIndex: 'isOpen',
      key: 'isOpen',
      render: (isOpen: boolean) => (isOpen ? '开启' : '关闭'),
    },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '币种', dataIndex: 'coinType', key: 'coinType' },
    {
      title: '操作',
      key: 'actions',
      render: (text: any, record: AirdropInfo) => (
        <Button
          type="link"
          onClick={() => handleWithdraw(record.round, record.coinType)}
          disabled={loading || !record.isOpen} // 禁用条件：正在加载或未开启
        >
          提款
        </Button>

      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {contextHolder}
      <h1>空投后台管理页面</h1>
      <Table
        dataSource={airdropList}
        columns={columns}
        rowKey="round"
        loading={loading}
      />
    </div>
  );
};

export default AdminPage;
