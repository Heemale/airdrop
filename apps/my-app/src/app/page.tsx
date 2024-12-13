'use client';

import React, { useEffect, useState } from 'react';
import { AIRDROPS, NODES } from '@local/airdrop-sdk/utils';
import { AirdropInfo } from '@local/airdrop-sdk/airdrop';
import { NodeInfo } from '@local/airdrop-sdk/node';
import { Button, Table, message, Modal, Input, Form, DatePicker } from 'antd';
import { airdropClient, nodeClient } from '@/sdk';
import { ADMIN_CAP } from '@local/airdrop-sdk/utils';
import ConnectButton from './components/ConnectButton';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import dayjs from 'dayjs'; // 使用 dayjs 处理日期
import { formatTimestamp } from '../utils/time';
import { convertSmallToLarge } from '../utils/math';


const AdminPage = () => {
  const [airdropList, setAirdropList] = useState<AirdropInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showModal, setShowModal] = useState(false); // 控制弹窗显示
  const [showNodeModal, setShowNodeModal] = useState(false); // 控制节点弹窗显示
  const [showNewNodeModal, setShowNewNodeModal] = useState(false); // 控制新增节点弹窗显示
  const [editingNode, setEditingNode] = useState<NodeInfo | null>(null); // 当前编辑的节点信息
  const [form] = Form.useForm(); // 表单控制
  const account = useCurrentAccount();
  const [nodeForm] = Form.useForm(); // 节点表单控制
  const [nodeList, setNodeList] = useState<NodeInfo[]>([]); // 节点列表数据
  const account1 = account?.address;
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  // 获取空投列表
  const fetchAirdropList = async () => {
    try {
      setLoading(true);
      const list = await airdropClient.airdrops(AIRDROPS);
      console.log('Airdrop list:', list);
      
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
    } catch (error) {
      messageApi.error('提取失败');
      console.error(" error:", error);
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

      const { totalShares, totalBalance, description, image_url, amount, coinType } = values;


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
        image_url,
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
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' , render: (startTime: bigint) => formatTimestamp(startTime), },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime',render: (endTime: bigint) => formatTimestamp(endTime), },
    { title: '总份数', dataIndex: 'totalShares', key: 'totalShares' },
    { title: '已领取份数', dataIndex: 'claimedShares', key: 'claimedShares' },
    { title: '总余额', dataIndex: 'totalBalance', key: 'totalBalance',render:(totalBalance: bigint) => convertSmallToLarge(totalBalance,9) },
    {
      title: '是否开启',
      dataIndex: 'isOpen',
      key: 'isOpen',
      render: (isOpen: boolean) => (isOpen ? '开启' : '关闭'),
    },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '币种', dataIndex: 'coinType', key: 'coinType' },
    { title: '剩余金额', dataIndex: 'remaining_balance', key: 'remaining_balance',render:(remaining_balance: bigint) => convertSmallToLarge(remaining_balance,9) },
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

  // 获取节点列表
  const fetchNodeList = async () => {
    try {
      setLoading(true);
      const list = await nodeClient.nodeList(NODES);
      setNodeList(list);
    } catch (error) {
      messageApi.error('获取节点列表失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // 新建节点功能
  const handleCreateNode = async (values: any) => {
    try {
      if (!account1) {
        messageApi.error('请先连接钱包');
        return;
      }
      setLoading(true);
      const { name, description, limit, price, total_quantity } = values;
      console.log('节点信息:', values);
      console.log('节点信息:',limit, price, total_quantity);
      const result = await airdropClient.insertNode(
        ADMIN_CAP,
        NODES,
        name,
        description,
        BigInt(limit),
        BigInt(price),
        BigInt(total_quantity)
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
            await fetchNodeList();
          },
          onError: ({ message }) => {
            console.log(`新建节点失败: ${message}`);
            messageApi.error(`Error: ${message}`);
            setLoading(false);
          },
        },
      );
      setShowNewNodeModal(false);
    } catch (error) {
      messageApi.error('新建节点失败');
      console.error("Create Node error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodeList();
  }, [])


  // 修改节点信息
  const handleUpdateNode = async (values: NodeInfo) => {
    try {
      if (!editingNode) return;

      console.log('节点更新数据:', values.price);

      const priceBigInt = BigInt(values.price || 0); // 提供默认值
      console.log('节点更新数据:', values.price);

      const result = await airdropClient.modifyNode(
        ADMIN_CAP,
        NODES,
        values.rank,
        values.name,
        values.description,
        priceBigInt
      );
      signAndExecuteTransaction(
        { transaction: result },
        {
          onSuccess: async (tx) => {
            console.log('节点更新成功:', tx.digest);
            messageApi.success('节点更新成功');
            setShowNodeModal(false);
            fetchNodeList(); // 更新节点列表
          },
          onError: ({ message }) => {
            console.error('节点更新失败:', message);
            messageApi.error('节点更新失败');
          },
        }
      );
    } catch (error) {
      messageApi.error('节点更新失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirdropList();
    fetchNodeList(); // 页面加载时获取节点列表
  }, []);

  // 节点表格列配置
  const nodeColumns = [
    { title: '等级', dataIndex: 'rank', key: 'rank' },
    { title: '称号', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '价格', dataIndex: 'price', key: 'price' },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: NodeInfo) => (
        <Button
          type="link"
          onClick={() => {
            setEditingNode(record);
            setShowNodeModal(true);
            nodeForm.setFieldsValue({
              rank: record.rank,
              name: record.name,
              description: record.description,
              price: record.price.toString(),
            });
          }}
        >
          修改
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
<div style={{ marginBottom: '20px' }}></div>
     
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
    {/* 代币类型 */}
    <Form.Item
      name="coinType"
      label="代币类型"
      rules={[{ required: true, message: '请输入代币类型' }]}
    >
      <Input placeholder="请输入代币类型" />
    </Form.Item>

    {/* 开始时间 */}
    <Form.Item
      name="startTime"
      label="开始时间"
      rules={[{ required: true, message: '请选择开始时间' }]}
    >
      <DatePicker 
        showTime 
        format="YYYY-MM-DD HH:mm:ss" 
        popupStyle={{
          maxWidth: '20vw',
          maxHeight: '50vh',
          overflow: 'auto',
        }}
        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      />
    </Form.Item>

    {/* 结束时间 */}
    <Form.Item
      name="endTime"
      label="结束时间"
      rules={[{ required: true, message: '请选择结束时间' }]}
    >
      <DatePicker 
        showTime 
        format="YYYY-MM-DD HH:mm:ss" 
        popupStyle={{
          maxWidth: '20vw',
          maxHeight: '50vh',
          overflow: 'auto',
        }}
        getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
      />
    </Form.Item>

    {/* 总份数 */}
    <Form.Item
      name="totalShares"
      label="总份数"
      rules={[{ required: true, message: '请输入总份数' }]}
    >
      <Input type="number" placeholder="请输入总份数" />
    </Form.Item>

    {/* 总余额 */}
    <Form.Item
      name="totalBalance"
      label="总余额"
      rules={[{ required: true, message: '请输入总余额' }]}
    >
      <Input type="number" placeholder="请输入总余额" />
    </Form.Item>

    {/* 描述 */}
    <Form.Item
      name="description"
      label="描述"
      rules={[{ required: true, message: '请输入描述' }]}
    >
      <Input placeholder="请输入描述" />
    </Form.Item>

    {/* 图片 */}
    <Form.Item
      name="image_url"
      label="图片"
      rules={[{ required: true, message: '请输入图片链接' }]}
    >
      <Input placeholder="请输入图片链接" />
    </Form.Item>

    {/* 金额 */}
    <Form.Item
      name="amount"
      label="金额"
      rules={[{ required: true, message: '请输入金额' }]}
    >
      <Input type="number" placeholder="请输入金额" />
    </Form.Item>

    {/* 提交按钮 */}
    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button 
        type="primary" 
        htmlType="submit" 
        loading={loading}
      >
        创建空投
      </Button>
    </Form.Item>
  </Form>
</Modal>

      <Button
        type="primary"
        onClick={() => setShowNewNodeModal(true)} // 点击按钮显示弹窗
        style={{ marginBottom: '20px' }}
      >
        新建节点
      </Button>

      <h1>节点管理</h1>
      <Table
        dataSource={nodeList}
        columns={nodeColumns}
        rowKey="rank"
        loading={loading}
      />
      {/* 新建节点的弹窗 */}
      <Modal
        title="新建节点"
        visible={showNewNodeModal}
        onCancel={() => setShowNewNodeModal(false)} // 关闭弹窗
        footer={null} // 关闭默认按钮
      >
        <Form
          form={form}
          onFinish={handleCreateNode} // 提交表单
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="name"
            label="节点名称"
            rules={[{ required: true, message: '请输入名称' }]}
          >

            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input placeholder="请输入描述" />
          </Form.Item>
          <Form.Item
            name="limit"
            label="空投次数"
            rules={[{ required: true, message: '请输入空投次数' }]}
          >
            <Input type="number" placeholder="请输入空投次数" />
          </Form.Item>
          <Form.Item
            name="price"
            label="金额"
            rules={[{ required: true, message: '请输入金额' }]}
          >
            <Input type="number" placeholder="请输入金额" />
          </Form.Item>
          <Form.Item
            name="total_quantity"
            label="数量"
            rules={[{ required: true, message: '请输入总数量' }]}
          >
            <Input type="number" placeholder="请输入总数量" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading} onClick={handleCreateNode}
            >
              创建节点 <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            </Form.Item>
            </Button>
          </Form.Item>          
        </Form>
      </Modal>
      {/* 修改节点信息弹窗 */}
      <Modal
        title="修改节点信息"
        visible={showNodeModal}
        onCancel={() => setShowNodeModal(false)}
        footer={null}
      >
        <Form
          form={nodeForm}
          onFinish={handleUpdateNode}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            name="rank"
            label="等级"
            rules={[{ required: true, message: '请输入等级' }]}
          >
            <Input type="number" disabled />
          </Form.Item>

          <Form.Item
            name="name"
            label="称号"
            rules={[{ required: true, message: '请输入称号' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={loading} >
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>

  );
};
export default AdminPage;
