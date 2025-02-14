"use client";

import React, { useEffect, useState } from "react";
import {
  AIRDROPS,
  NODES,
  INVITE,
  PAY_COIN_TYPE,
} from "@/sdk/constants";
import {
  Button,
  Table,
  message,
  Modal,
  Input,
  Form,
  DatePicker,
  Switch,
} from "antd";
import {
  airdropClient,
  nodeClient,
  inviteClient,
  devTransaction,
  getCoinMetaData,
} from "@/sdk";
import { ADMIN_CAP } from "@local/airdrop-sdk/utils";
import ConnectButton from "./components/ConnectButton";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import dayjs from "dayjs";
import { formatTimestamp } from "../utils/time";
import { convertLargeToSmall, convertSmallToLarge } from "../utils/math";
import { handleDevTxError } from "@/sdk/error";
import { isHexString } from "@/utils";

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
  price: string;
  // 总量
  total_quantity: bigint;
  // 已购买的数量
  purchased_quantity: bigint;
  // 是否开启
  isOpen: boolean;
}

export interface AirdropInfo {
  // 轮次
  round: bigint;
  // 开始时间
  startTime: bigint;
  // 结束时间
  endTime: bigint;
  // 总份数
  totalShares: bigint;
  // 已领取份数
  claimedShares: bigint;
  // 总资金
  totalBalance: string;
  // 是否开放
  isOpen: boolean;
  // 描述
  description: string;
  // 图片链接
  image_url: string;
  // 货币类型
  coinType: string;
  //剩余金额
  remaining_balance: string;
}

const AdminPage = () => {
  const [airdropList, setAirdropList] = useState<AirdropInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [showModal, setShowModal] = useState(false); // 控制弹窗显示
  const [showAirdropModal, setShowAirdropModal] = useState(false); // 控制新增空投弹窗显示
  const [showNodeModal, setShowNodeModal] = useState(false); // 控制节点弹窗显示
  const [showNewNodeModal, setShowNewNodeModal] = useState(false); // 控制新增节点弹窗显示
  const [editingNode, setEditingNode] = useState<NodeInfo | null>(null); // 当前编辑的节点信息
  const [form] = Form.useForm(); // 表单控制
  const account = useCurrentAccount();
  const [nodeForm] = Form.useForm(); // 节点表单控制
  const [nodeList, setNodeList] = useState<NodeInfo[]>([]); // 节点列表数据
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [editingAirdrop, setEditingAirdrop] = useState<AirdropInfo | null>(
    null,
  );
  const [root, setRoot] = useState<string | null>(null);
  const [fee, setFee] = useState<number>(0);
  const [receiver_, set_receiver] = useState<string | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false); // 控制邀请弹窗显示
  const [editReceiver, setEditReceiver] = useState(false);

  // 表格列配置
  const columns = [
    { title: "轮次", dataIndex: "round", key: "round" },
    {
      title: "开始时间",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime: bigint) => formatTimestamp(startTime),
    },
    {
      title: "结束时间",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime: bigint) => formatTimestamp(endTime),
    },
    { title: "总份数", dataIndex: "totalShares", key: "totalShares" },
    { title: "已领取份数", dataIndex: "claimedShares", key: "claimedShares" },
    {
      title: "总金额",
      dataIndex: "totalBalance",
      key: "totalBalance",
    },
    {
      title: "是否开启",
      dataIndex: "isOpen",
      key: "isOpen",
      render: (isOpen: boolean) => (isOpen ? "开启" : "关闭"),
    },
    { title: "描述", dataIndex: "description", key: "description" },
    {
      title: "币种",
      dataIndex: "coinType",
      key: "coinType",
      render: (coinType: string) => {
        return isHexString(coinType) ? coinType : "0x" + coinType;
      },
    },
    {
      title: "剩余金额",
      dataIndex: "remaining_balance",
      key: "remaining_balance",
    },
    {
      title: "操作",
      key: "actions",
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
    {
      title: "修改",
      key: "actions",
      render: (_: any, record: AirdropInfo) => (
        <Button
          type="link"
          onClick={() => {
            setEditingAirdrop(record);
            setShowAirdropModal(true);
            form.setFieldsValue({
              round: record.round,
              startTime: dayjs(Number(record.startTime)),
              endTime: dayjs(Number(record.endTime)),
              isOpen: record.isOpen,
              description: record.description,
            });
          }} // 禁用条件：正在加载、未开启或未连接钱包
        >
          修改
        </Button>
      ),
    },
  ];

  // 获取空投列表
  const fetchAirdropList = async () => {
    try {
      setLoading(true);
      const list = await airdropClient.airdrops(AIRDROPS);
      setAirdropList(
        await Promise.all(
          list.map(async (item) => {
            const coinType = isHexString(item.coinType)
              ? item.coinType
              : "0x" + item.coinType;
            const coinMetaData = await getCoinMetaData({ coinType });
            const { totalBalance, remaining_balance, ...rest } = item;
            return {
              totalBalance: convertLargeToSmall(
                totalBalance,
                coinMetaData ? coinMetaData.decimals : 9,
              ),
              remaining_balance: convertLargeToSmall(
                remaining_balance,
                coinMetaData ? coinMetaData.decimals : 9,
              ),
              ...rest,
            };
          }),
        ),
      );
    } catch (error: any) {
      messageApi.error(`获取空投列表失败: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 提款功能
  const handleWithdraw = async (round: bigint, coinType: string) => {
    if (!account) {
      messageApi.error("请先连接钱包");
      return;
    }

    try {
      setLoading(true);

      const tx = airdropClient.withdraw(coinType, ADMIN_CAP, AIRDROPS, round);

      await devTransaction(tx, account.address);

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: async (tx) => {
            messageApi.info(`提取成功: ${tx.digest}`);
            setLoading(false);
            await fetchAirdropList();
          },
          onError: ({ message }) => {
            messageApi.error(`提取失败: ${message}`);
            setLoading(false);
          },
        },
      );
    } catch (e: any) {
      messageApi.error(handleDevTxError(e.message.trim()));
      setLoading(false);
      return;
    }
  };

  // 新建空投功能
  const handleCreateAirdrop = async (values: any) => {
    if (!account) {
      messageApi.error("请先连接钱包");
      return;
    }

    try {
      setLoading(true);

      const coinType = isHexString(values.coinType)
        ? values.coinType
        : "0x" + values.coinType;
      const coinMetaData = await getCoinMetaData({
        coinType,
      });

      if (!coinMetaData) {
        messageApi.error("获取代币元数据失败");
        return;
      }

      const tx = await airdropClient.insert(
        values.coinType,
        ADMIN_CAP,
        AIRDROPS,
        BigInt(dayjs(values.startTime).valueOf()),
        BigInt(dayjs(values.endTime).valueOf()),
        BigInt(values.totalShares),
        BigInt(convertLargeToSmall(values.totalBalance, coinMetaData.decimals)),
        values.description,
        null,
        values.image_url,
        BigInt(convertLargeToSmall(values.totalBalance, coinMetaData.decimals)),
        account.address,
      );

      await devTransaction(tx, account.address);

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: async (tx) => {
            messageApi.info(`创建空投成功: ${tx.digest}`);
            setLoading(false);
            setShowModal(false); // 关闭弹窗
            await fetchAirdropList();
          },
          onError: ({ message }) => {
            messageApi.error(`新建空投失败: ${message}`);
            setLoading(false);
          },
        },
      );
    } catch (e: any) {
      messageApi.error(handleDevTxError(e.message.trim()));
      setLoading(false);
      return;
    }
  };

  const handleUpdateAirdrop = async (values: any) => {
    if (!account) {
      messageApi.error("请先连接钱包");
      return;
    }
    if (!editingAirdrop) return;

    try {
      const startTime = dayjs(values.startTime).valueOf();
      const endTime = dayjs(values.endTime).valueOf();
      const tx = airdropClient.modify(
        ADMIN_CAP,
        AIRDROPS,
        values.round,
        BigInt(startTime),
        BigInt(endTime),
        values.isOpen,
        values.description,
      );

      await devTransaction(tx, account.address);

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (tx) => {
            messageApi.success(`空投更新成功: ${tx.digest}`);
            setShowAirdropModal(false);
            fetchAirdropList(); // 更新节点列表
          },
          onError: ({ message }) => {
            messageApi.error(`空投更新失败: ${message}`);
          },
        },
      );
    } catch (e: any) {
      messageApi.error(handleDevTxError(e.message.trim()));
      setLoading(false);
      return;
    }
  };

  // 节点表格列配置
  const nodeColumns = [
    { title: "节点等级", dataIndex: "rank", key: "rank" },
    { title: "节点称号", dataIndex: "name", key: "name" },
    { title: "节点描述", dataIndex: "description", key: "description" },
    { title: "每轮空投可领取次数", dataIndex: "limit", key: "limit" },
    {
      title: "节点售价",
      dataIndex: "price",
      key: "price",
    },
    { title: "节点总数量", dataIndex: "total_quantity", key: "total_quantity" },
    {
      title: "节点是否开启",
      dataIndex: "isOpen",
      key: "isOpen",
      render: (isOpen: boolean) => (isOpen ? "开启" : "关闭"),
    },
    {
      title: "操作",
      key: "actions",
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
              price: record.price,
              limit: record.limit,
              total_quantity: record.total_quantity,
              isOpen: record.isOpen,
            });
          }}
        >
          修改
        </Button>
      ),
    },
  ];

  // 获取节点列表
  const fetchNodeList = async () => {
    try {
      setLoading(true);
      const [list, coinMetaData] = await Promise.all([
        nodeClient.nodeList(NODES),
        getCoinMetaData({ coinType: PAY_COIN_TYPE }),
      ]);
      setNodeList(
        list.map((item) => {
          const { price, ...rest } = item;
          return {
            price: convertSmallToLarge(
              price,
              coinMetaData ? coinMetaData.decimals : 9,
            ),
            ...rest,
          };
        }),
      );
    } catch (error: any) {
      messageApi.error(`获取节点列表失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 新建节点功能
  const handleCreateNode = async (values: any) => {
    if (!account) {
      messageApi.error("请先连接钱包");
      return;
    }

    try {
      setLoading(true);

      const coinMetaData = await getCoinMetaData({
        coinType: PAY_COIN_TYPE,
      });

      if (!coinMetaData) {
        messageApi.error("获取代币元数据失败");
        return;
      }

      const { name, description, limit, price, total_quantity } = values;
      const tx = airdropClient.insertNode(
        ADMIN_CAP,
        NODES,
        name,
        description,
        BigInt(limit),
        BigInt(convertLargeToSmall(price, coinMetaData.decimals)),
        BigInt(total_quantity),
      );

      await devTransaction(tx, account.address);

      signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: async (tx) => {
            messageApi.info(`新建节点成功: ${tx.digest}`);
            setLoading(false);
            await fetchNodeList();
          },
          onError: ({ message }) => {
            messageApi.error(`新建节点失败: ${message}`);
            setLoading(false);
          },
        },
      );
    } catch (e: any) {
      messageApi.error(handleDevTxError(e.message.trim()));
      setLoading(false);
      return;
    }
  };

  // 修改节点信息
  const handleUpdateNode = async (values: NodeInfo) => {
    if (!account) {
      messageApi.error("请先连接钱包");
      return;
    }
    if (!editingNode) return;

    try {
      const coinMetaData = await getCoinMetaData({
        coinType: PAY_COIN_TYPE,
      });

      if (!coinMetaData) {
        messageApi.error("获取代币元数据失败");
        return;
      }

      const tx = airdropClient.modifyNode(
        ADMIN_CAP,
        NODES,
        values.rank,
        values.name,
        values.description,
        BigInt(convertLargeToSmall(values.price, coinMetaData.decimals) || 0),
        values.limit,
        values.total_quantity,
        values.isOpen,
      );

      await devTransaction(tx, account.address);

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (tx) => {
            messageApi.success(`节点更新成功: ${tx.digest}`);
            setShowNodeModal(false);
            fetchNodeList(); // 更新节点列表
          },
          onError: ({ message }) => {
            messageApi.error(`节点更新失败: ${message}`);
          },
        },
      );
    } catch (e: any) {
      messageApi.error(handleDevTxError(e.message.trim()));
      setLoading(false);
      return;
    }
  };

  const fetchInviteInfo = async () => {
    try {
      const [root, fee] = await Promise.all([
        await inviteClient.root(INVITE),
        await inviteClient.inviterFee(INVITE),
      ]);
      setFee(fee);
      setRoot(root);
    } catch (error: any) {
      messageApi.error(`获取分红信息失败: ${error.message}`);
      console.error(error);
    }
  };

  const handleInvite = async (value: any) => {
    if (!account) {
      messageApi.error("请先连接钱包");
      return;
    }

    try {
      const { root, inviter_fee } = value;
      if (inviter_fee < 0.01) {
        console.error("分红比例不能低于0.01%");
        return;
      }

      const tx = airdropClient.modifyInvite(
        ADMIN_CAP,
        INVITE,
        root,
        BigInt(inviter_fee * 100),
      );

      await devTransaction(tx, account.address);

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (tx) => {
            messageApi.success(`更新成功: ${tx.digest}`);
            setShowInviteModal(false);
          },
          onError: ({ message }) => {
            console.error("更新失败:", message);
            messageApi.error(`更新失败: ${message}`);
          },
        },
      );
    } catch (e: any) {
      messageApi.error(handleDevTxError(e.message.trim()));
      setLoading(false);
      return;
    }
  };

  const fetchReceiver = async () => {
    try {
      const receivers = await nodeClient.receiver(NODES);
      set_receiver(receivers);
    } catch (error: any) {
      messageApi.error(`获取分红信息失败: ${error.message}`);
      console.error(error);
    }
  };

  const handleNode = async (value: any) => {
    if (!account) {
      messageApi.error("请先连接钱包");
      return;
    }

    try {
      const { receiver } = value;
      const tx = airdropClient.modify_nodes(
        PAY_COIN_TYPE,
        ADMIN_CAP,
        NODES,
        receiver,
      );

      await devTransaction(tx, account.address);

      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (tx) => {
            messageApi.success(`修改接收人成功: ${tx.digest}`);
            setShowInviteModal(false);
          },
          onError: ({ message }) => {
            messageApi.error(`修改接收人失败: ${message}`);
          },
        },
      );
    } catch (e: any) {
      messageApi.error(handleDevTxError(e.message.trim()));
      setLoading(false);
      return;
    }
  };

  useEffect(() => {
    fetchAirdropList();
    fetchNodeList();
    fetchInviteInfo();
    fetchReceiver();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4">
      {contextHolder}
      <div>
        <ConnectButton connectText={"CONNECT"} />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h1>空投管理</h1>
          <Button
            type="primary"
            onClick={() => setShowModal(true)} // 点击按钮显示弹窗
          >
            新建空投
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table
            dataSource={airdropList}
            columns={columns}
            rowKey="round"
            loading={loading}
            className="text-nowrap"
          />
          {/* 新建空投的弹窗 */}
          <Modal
            title="新建空投"
            open={showModal}
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
                rules={[{ required: true, message: "请输入代币类型" }]}
              >
                <Input placeholder="请输入代币类型" />
              </Form.Item>
              <Form.Item
                name="startTime"
                label="开始时间"
                rules={[{ required: true, message: "请选择开始时间" }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  popupStyle={{
                    maxWidth: "20vw",
                    maxHeight: "50vh",
                    overflow: "auto",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="endTime"
                label="结束时间"
                rules={[{ required: true, message: "请选择结束时间" }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  popupStyle={{
                    maxWidth: "20vw",
                    maxHeight: "50vh",
                    overflow: "auto",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="totalShares"
                label="总份数"
                rules={[{ required: true, message: "请输入总份数" }]}
              >
                <Input type="number" placeholder="请输入总份数" />
              </Form.Item>

              <Form.Item
                name="totalBalance"
                label="总金额"
                rules={[{ required: true, message: "请输入总金额" }]}
              >
                <Input type="number" placeholder="请输入总金额" />
              </Form.Item>

              <Form.Item
                name="description"
                label="描述"
                rules={[{ required: true, message: "请输入描述" }]}
              >
                <Input placeholder="请输入描述" />
              </Form.Item>
              <Form.Item
                name="image_url"
                label="图片"
                rules={[{ required: true, message: "请输入图片" }]}
              >
                <Input placeholder="请输入图片" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  创建空投
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="修改空投信息"
            open={showAirdropModal}
            onCancel={() => setShowAirdropModal(false)}
            footer={null}
          >
            <Form
              form={form}
              onFinish={handleUpdateAirdrop}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item
                name="round"
                label="轮次"
                rules={[{ required: true, message: "请输入轮次" }]}
              >
                <Input type="number" disabled />
              </Form.Item>

              {/* 开始时间 */}
              <Form.Item
                name="startTime"
                label="开始时间"
                rules={[{ required: true, message: "请选择开始时间" }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  popupStyle={{
                    maxWidth: "20vw",
                    maxHeight: "50vh",
                    overflow: "auto",
                  }}
                  getPopupContainer={(triggerNode) =>
                    triggerNode.parentNode as HTMLElement
                  }
                />
              </Form.Item>

              {/* 结束时间 */}
              <Form.Item
                name="endTime"
                label="结束时间"
                rules={[{ required: true, message: "请选择结束时间" }]}
              >
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  popupStyle={{
                    maxWidth: "20vw",
                    maxHeight: "50vh",
                    overflow: "auto",
                  }}
                  getPopupContainer={(triggerNode) =>
                    triggerNode.parentNode as HTMLElement
                  }
                />
              </Form.Item>

              <Form.Item name="isOpen" label="是否开启" valuePropName="checked">
                <Switch />
              </Form.Item>
              {/* 描述 */}
              <Form.Item
                name="description"
                label="描述"
                rules={[{ required: true, message: "请输入描述" }]}
              >
                <Input placeholder="请输入描述" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-x-auto">
        <div className="flex items-center gap-4">
          <h1>节点管理</h1>
          <Button
            type="primary"
            onClick={() => setShowNewNodeModal(true)} // 点击按钮显示弹窗
          >
            新建节点
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table
            dataSource={nodeList}
            columns={nodeColumns}
            rowKey="rank"
            loading={loading}
            className="text-nowrap"
          />
          {/* 新建节点的弹窗 */}
          <Modal
            title="新建节点"
            open={showNewNodeModal}
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
                rules={[{ required: true, message: "请输入节点名称" }]}
              >
                <Input placeholder="请输入节点名称" />
              </Form.Item>
              <Form.Item
                name="description"
                label="节点描述"
                rules={[{ required: true, message: "请输入节点描述" }]}
              >
                <Input placeholder="请输入节点描述" />
              </Form.Item>
              <Form.Item
                name="limit"
                label="每轮空投可领取次数"
                rules={[
                  { required: true, message: "请输入每轮空投可领取次数" },
                ]}
              >
                <Input type="number" placeholder="请输入每轮空投可领取次数" />
              </Form.Item>
              <Form.Item
                name="price"
                label="节点售价"
                rules={[{ required: true, message: "请输入节点售价" }]}
              >
                <Input
                  type="number"
                  placeholder="请输入节点售价"
                  value={convertSmallToLarge(form.getFieldValue("price"), 9)}
                />
              </Form.Item>
              <Form.Item
                name="total_quantity"
                label="节点总数量"
                rules={[{ required: true, message: "请输入节点总数量" }]}
              >
                <Input type="number" placeholder="请输入节点总数量" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  创建节点
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          {/* 修改节点信息弹窗 */}
          <Modal
            title="修改节点信息"
            open={showNodeModal}
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
                label="节点等级"
                rules={[{ required: true, message: "请输入节点等级" }]}
              >
                <Input type="number" disabled />
              </Form.Item>

              <Form.Item
                name="name"
                label="节点名称"
                rules={[{ required: true, message: "请输入节点名称" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="节点描述"
                rules={[{ required: true, message: "节点描述" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="limit"
                label="每轮空投可领取次数"
                rules={[
                  { required: true, message: "请输入每轮空投可领取次数" },
                ]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="price"
                label="节点售价"
                rules={[{ required: true, message: "请输入节点售价" }]}
              >
                <Input
                  type="number"
                  value={convertSmallToLarge(form.getFieldValue("price"), 9)}
                />
              </Form.Item>
              <Form.Item
                name="total_quantity"
                label="节点总数量"
                rules={[{ required: true, message: "节点总数量" }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item name="isOpen" label="是否开启" valuePropName="checked">
                <Switch />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-x-auto">
        <div className="overflow-x-auto">
          <h3>根用户: {root !== null ? root : "Loading..."}</h3>
          <h3>邀请人分红费率: {fee !== null ? fee / 100 : "Loading..."}%</h3>
          <Button
            type="primary"
            onClick={() => setShowInviteModal(true)} // 点击按钮显示弹窗
            style={{ marginBottom: "20px" }}
          >
            修改分红
          </Button>

          <Modal
            title="修改分红"
            open={showInviteModal}
            onCancel={() => setShowInviteModal(false)} // 关闭弹窗
            footer={null} // 关闭默认按钮
          >
            <Form
              form={form}
              onFinish={handleInvite} // 提交表单
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                root: root,
                inviter_fee: fee / 100,
              }}
            >
              <Form.Item
                name="root"
                label="根用户"
                rules={[{ required: true, message: "请输入根用户" }]}
              >
                <Input placeholder="请输入根用户" />
              </Form.Item>
              <Form.Item
                name="inviter_fee"
                label="邀请人分红费率"
                rules={[{ required: true, message: "请输入邀请人分红费率" }]}
              >
                <Input type="number" placeholder="请输入邀请人分红费率" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  提交
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <div className="flex flex-col gap-4 overflow-x-auto">
        <div className="overflow-x-auto">
          <h3>
            出售节点资金接收人: {receiver_ !== null ? receiver_ : "null..."}
          </h3>

          <Button
            type="primary"
            onClick={() => setEditReceiver(true)} // 点击按钮显示弹窗
            style={{ marginBottom: "20px" }}
          >
            修改接收人
          </Button>
          <Modal
            title="修改接收人"
            open={editReceiver}
            onCancel={() => setEditReceiver(false)} // 关闭弹窗
            footer={null} // 关闭默认按钮
          >
            <Form
              form={form}
              onFinish={handleNode} // 提交表单
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{
                receiver: receiver_ ? receiver_ : "",
              }}
            >
              <Form.Item
                name="receiver"
                label="接收人"
                rules={[{ required: true, message: "请输入接收人" }]}
              >
                <Input placeholder="请输入接收人" />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit" loading={loading}>
                  提交
                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}></Form.Item>
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};
export default AdminPage;
