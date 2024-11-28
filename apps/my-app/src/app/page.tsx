'use client';

import React, { useEffect, useState } from 'react';
import { AIRDROPS } from '@local/airdrop-sdk/utils';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';
import { Button, Table, message, Modal, Input, Form, DatePicker } from 'antd';
import { airdropClient } from '@/sdk';
import { ADMIN_CAP } from '@local/airdrop-sdk/utils';
import ConnectButton from './components/ConnectButton';
import { useCurrentAccount,useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import dayjs from 'dayjs'; // 使用 dayjs 处理日期

const AdminPage = () => {
  const [airdropList, setAirdropList] = useState<AirdropInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showModal, setShowModal] = useState(false); // 控制弹窗显示
  const [form] = Form.useForm(); // 表单控制
  const account = useCurrentAccount();
  const account1 = account?.address;
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

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
    if (!account1) {
      messageApi.error('请先连接钱包');
      return;
    }

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

  // 新建空投功能
  const handleCreateAirdrop = async (values: any) => {
    try {
      if (!account1) {
        messageApi.error('请先连接钱包');
        return;
      }
      setLoading(true);

      // 将日期选择转换为毫秒级时间戳
      const startTime = dayjs(values.startTime).valueOf(); // 转换为毫秒级时间戳
      const endTime = dayjs(values.endTime).valueOf(); // 转换为毫秒级时间戳

      const { totalShares, totalBalance, description, amount,coinType } = values;

      // 调用 airdropClient.insert 方法
      const result = await airdropClient.insert(
        coinType, 
        ADMIN_CAP, 
        AIRDROPS, 
        BigInt(startTime), // 转换后的毫秒时间戳
        BigInt(endTime), // 转换后的毫秒时间戳
        BigInt(totalShares), 
        BigInt(totalBalance), 
        description, 
        null, // 连接的钱包地址
        BigInt(amount), 
        account1
      );
      signAndExecuteTransaction(
        {
          transaction: result,
        },
        {
          onSuccess: async (tx) => {
            console.log({ digest: tx.digest });
            messageApi.info(`Success: ${tx.digest}`);
            setLoading(false);
            await fetchAirdropList();
          },
          onError: ({ message }) => {
            console.log(`新建空投失败: ${message}`);
            messageApi.error(`Error: ${message}`);
            setLoading(false);
          },
        },
      );
      // console.log("Create Airdrop transaction result:", result); // 打印结果
      // messageApi.success('新建空投成功');
      setShowModal(false); // 关闭弹窗
    } catch (error) {
      messageApi.error('新建空投失败');
      console.error("Create Airdrop error:", error);
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
          disabled={loading || !record.isOpen || !account} // 禁用条件：正在加载、未开启或未连接钱包
        >
          提款
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {contextHolder}
      <ConnectButton connectText={'CONNECT'} />
      <Button
        type="primary"
        onClick={() => setShowModal(true)} // 点击按钮显示弹窗
        style={{ marginBottom: '20px' }}
      >
        新建空投
      </Button>

      <h1>空投后台管理页面</h1>
      <Table
        dataSource={airdropList}
        columns={columns}
        rowKey="round"
        loading={loading}
      />

      {/* 新建空投的弹窗 */}
      <Modal
        title="新建空投"
        visible={showModal}
        onCancel={() => setShowModal(false)} // 关闭弹窗
        footer={null} // 关闭默认按钮
      >
        <Form
          form={form}
          onFinish={handleCreateAirdrop} // 提交表单
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="coinType"
            label="代币类型"
            rules={[{ required: true, message: '请输入类型' }]}
          >

            <Input placeholder="请输入类型" />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="结束时间"
            rules={[{ required: true, message: '请选择结束时间' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>

          <Form.Item
            name="totalShares"
            label="总份数"
            rules={[{ required: true, message: '请输入总份数' }]}
          >
            <Input type="number" placeholder="请输入总份数" />
          </Form.Item>

          <Form.Item
            name="totalBalance"
            label="总余额"
            rules={[{ required: true, message: '请输入总余额' }]}
          >
            <Input type="number" placeholder="请输入总余额" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input placeholder="请输入描述" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="金额"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <Input type="number" placeholder="请输入金额" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading} onClick={handleCreateAirdrop}
            >
              创建空投
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;
