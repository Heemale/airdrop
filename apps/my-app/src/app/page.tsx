"use client";

import React, { useEffect, useState } from "react";
import {
  AIRDROPS,
  NODES,
  INVITE,
  PAY_COIN_TYPE,
  LIMITS,
  ADMIN_CAP,
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
import { getNodeInfo } from "@/api";

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
  // 是否开启
  isOpen: boolean;
  isRemove: boolean;
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
  const [removeNode, setRemoveNode] = useState<number | null>(null); // 当前编辑的节点信息
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
  const [showRmoveNodeModal, setShowRmoveNodeModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false); // 控制邀请弹窗显示
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [editReceiver, setEditReceiver] = useState(false);
  console.log("account", account);
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

  function checkImageExists(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  }

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

      // 检查图片链接是否有效，若无效则使用默认图片
      const validImageUrl = (await checkImageExists(values.image_url))
        ? values.image_url
        : "/sui-sui-logo.png"; // 替换成你的默认图片路径

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
        validImageUrl, // 使用有效的图片链接
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
      title: "节点是否移除",
      dataIndex: "isRemove",
      key: "isRemove",
      render: (isRemove: boolean) => (isRemove ? "已移除" : "未移除"),
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
    {
      title: "移除节点",
      key: "remove",
      render: (_: any, record: NodeInfo) => (
        <Button
          onClick={() => {
            setRemoveNode(record.rank);
            setShowRmoveNodeModal(true);
          }}
        >
          移除节点
        </Button>
      ),
    },
  ];

  // 获取节点列表
  const fetchNodeList = async () => {
    try {
      setLoading(true);
      console.log(2222222);
      const response = await getNodeInfo(); // 获取节点信息

      console.log("response", response);
      if (Array.isArray(response)) {
        console.log("11111", response);

        // 确保返回值是数组
        // 遍历返回的数据并赋值给 NodeInfo
        const formattedNodeList: NodeInfo[] = response.map((node) => ({
          rank: Number(node.rank), // 确保类型一致
          name: node.name,
          description: node.description,
          limit: BigInt(node.limit),
          price: BigInt(node.price),
          total_quantity: node.totalQuantity
            ? BigInt(node.totalQuantity)
            : BigInt(0), // 如果是 null 或 undefined，使用默认值 0
          purchased_quantity: node.purchasedQuantity
            ? BigInt(node.purchasedQuantity)
            : BigInt(0), // 如果是 null 或 undefined，使用默认值 0
          isOpen: node.isOpen,
          isRemove: node.isRemove,
        }));
        console.log("formattedNodeList", formattedNodeList);
        setNodeList(formattedNodeList); // 更新状态
      } else {
        // 如果返回的是单个节点，直接处理
        const node = response; // 假设 response 是单个节点
        const formattedNode: NodeInfo = {
          rank: Number(node.rank), // 确保类型一致
          name: node.name,
          description: node.description,
          limit: BigInt(node.limit),
          price: BigInt(node.price),
          total_quantity: node.totalQuantity
            ? BigInt(node.totalQuantity)
            : BigInt(0), // 如果是 null 或 undefined，使用默认值 0
          purchased_quantity: node.purchasedQuantity
            ? BigInt(node.purchasedQuantity)
            : BigInt(0), // 如果是 null 或 undefined，使用默认值 0
          isOpen: node.isOpen,
          isRemove: node.isRemove,
        };
        console.log("formattedNode111111111", formattedNode);

        setNodeList([formattedNode]); // 将单个节点包装成数组并更新状态
      }
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

  // 移除节点
  const handleRemoveNode = async () => {
    if (!account) {
      messageApi.error("请先连接钱包");
      return;
    }
    if (removeNode === null) return; // 确保 removeNode 有值
    console.log(123, removeNode);
    try {
      const tx = airdropClient.removeNode(ADMIN_CAP, NODES, removeNode);
      console.log("tx", tx);
      await devTransaction(tx, account.address);
      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (tx) => {
            messageApi.success(`节点移除成功: ${tx.digest}`);
            setShowRmoveNodeModal(false);
            fetchNodeList(); // 更新节点列表
          },
          onError: ({ message }) => {
            messageApi.error(`节点移除失败: ${message}`);
          },
        },
      );
      console.log(123123, tx);
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

  const handleModifyUserLimit = async (value: any) => {
    if (!account) {
      messageApi.error("请先连接钱包");
      return;
    }

    try {
      const { address, times, isLimit } = value;
      console.log("value", value);
      // 调用 modifyLimits 方法来修改用户的领取次数
      const tx = airdropClient.modifyLimits(
        ADMIN_CAP, // 管理员权限
        LIMITS, // 限制条件
        address, // 用户地址
        BigInt(times), // 领取次数（转换为BigInt）
        isLimit, // 是否有限制
      );
      console.log("handleModify", tx);
      // 提交交易
      await devTransaction(tx, account.address);

      // 签名并执行交易
      signAndExecuteTransaction(
        { transaction: tx },
        {
          onSuccess: async (tx) => {
            messageApi.success(`修改用户领取次数成功: ${tx.digest}`);
            setShowLimitModal(false); // 关闭模态框
          },
          onError: ({ message }) => {
            messageApi.error(`修改用户领取次数失败: ${message}`);
          },
        },
      );
    } catch (e: any) {
      messageApi.error(handleDevTxError(e.message.trim()));
      setLoading(false); // 关闭加载状态
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

          <Modal
            title="确认移除节点"
            open={showRmoveNodeModal}
            onCancel={() => setShowRmoveNodeModal(false)}
            onOk={handleRemoveNode}
            okText="确认"
            cancelText="取消"
          >
            <p>您确定要移除节点 "{removeNode}" 吗？</p>
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
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-x-auto">
        <div className="overflow-x-auto">
          <Button
            type="primary"
            onClick={() => setShowLimitModal(true)} // 显示弹窗
            style={{ marginBottom: "20px" }}
          >
            修改用户领取次数
          </Button>

          {/* 修改领取次数的弹窗 */}
          <Modal
            title="修改用户领取次数"
            open={showLimitModal}
            onCancel={() => setShowLimitModal(false)} // 关闭弹窗
            footer={null} // 关闭默认按钮
          >
            <Form
              form={form}
              onFinish={handleModifyUserLimit} // 提交表单时调用
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item
                name="address"
                label="接收人"
                rules={[{ required: true, message: "请输入接收人" }]}
              >
                <Input placeholder="请输入接收人" />
              </Form.Item>

              <Form.Item
                name="times"
                label="领取次数"
                rules={[{ required: true, message: "请输入领取次数" }]}
              >
                <Input type="number" placeholder="请输入领取次数" />
              </Form.Item>

              <Form.Item
                name="isLimit"
                label="是否限制"
                valuePropName="checked"
              >
                <Input type="checkbox" />
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
    </div>
  );
};
export default AdminPage;
