'use client';

import React, { useEffect, useState } from 'react';
import { airdropClient } from '@/sdk';
import { AIRDROPS } from '@local/airdrop-sdk/utils';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';
import { Button, Table, Modal, Input, message, Switch } from 'antd';

const AdminPage = () => {
  const [airdropList, setAirdropList] = useState<AirdropInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentAirdrop, setCurrentAirdrop] = useState<AirdropInfo | null>(null);
  const [formData, setFormData] = useState<Partial<Omit<AirdropInfo, 'claimedShares'>>>({}); // 不包含 claimedShares
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

  // 显示修改空投对话框
  const handleEdit = (record: AirdropInfo) => {
    setCurrentAirdrop(record);
    const { claimedShares, ...modifiableFields } = record; // 排除 claimedShares
    setFormData(modifiableFields);
    setEditModalVisible(true);
  };

  // 提交修改空投
  const handleEditSubmit = async () => {
    if (!currentAirdrop) return;
    try {
      setLoading(true);
      await airdropClient.modify(currentAirdrop.round, formData);
      messageApi.success('修改空投成功');
      fetchAirdropList(); // 更新列表
      setEditModalVisible(false);
    } catch (error) {
      messageApi.error('修改空投失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 提款功能
  const handleWithdraw = async (round: bigint) => {
    try {
      setLoading(true);
      await airdropClient.withdraw(round);
      messageApi.success('提款成功');
      fetchAirdropList(); // 更新列表
    } catch (error) {
      messageApi.error('提款失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 输入框值变化
  const handleInputChange = (key: keyof Omit<AirdropInfo, 'claimedShares'>, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    fetchAirdropList(); // 页面加载时获取空投列表
  }, []);

  // 表格列配置
  const columns = [
    {
      title: '轮次',
      dataIndex: 'round',
      key: 'round',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: '总份数',
      dataIndex: 'totalShares',
      key: 'totalShares',
    },
    {
      title: '已领取份数',
      dataIndex: 'claimedShares',
      key: 'claimedShares',
    },
    {
      title: '总余额',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
    {
      title: '是否开启',
      dataIndex: 'isOpen',
      key: 'isOpen',
      render: (isOpen: boolean) => (isOpen ? '开启' : '关闭'),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '币种',
      dataIndex: 'coinType',
      key: 'coinType',
    },
    {
      title: '操作',
      key: 'actions',
      render: (text: any, record: AirdropInfo) => (
        <>
          <Button
            type="link"
            onClick={() => handleEdit(record)}
            disabled={loading}
          >
            修改
          </Button>
          <Button
            type="link"
            onClick={() => handleWithdraw(record.round)}
            disabled={loading}
          >
            提款
          </Button>
        </>
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
      <Modal
        title="修改空投"
        visible={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setEditModalVisible(false)}
        confirmLoading={loading}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Input
      placeholder="开始时间"
      value={formData.startTime?.toString()}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange('startTime', BigInt(e.target.value))
      }
    />
    <Input
      placeholder="结束时间"
      value={formData.endTime?.toString()}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange('endTime', BigInt(e.target.value))
      }
    />
    <Input
      placeholder="总份数"
      value={formData.totalShares?.toString()}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange('totalShares', BigInt(e.target.value))
      }
    />
    <Input
      placeholder="总余额"
      value={formData.totalBalance?.toString()}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange('totalBalance', BigInt(e.target.value))
      }
    />
    <Input
      placeholder="描述"
      value={formData.description}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        handleInputChange('description', e.target.value)
      }
    />
    <Switch
      checked={formData.isOpen}
      onChange={(checked: boolean) =>
        handleInputChange('isOpen', checked)
      }
    />
        </div>
      </Modal>
    </div>
  );
};

export default AdminPage;
