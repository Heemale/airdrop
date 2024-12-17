"use client";

import React, { useEffect, useState } from "react";
import { AIRDROPS, NODES, INVITE } from "@local/airdrop-sdk/utils";
import { AirdropInfo } from "@local/airdrop-sdk/airdrop";
import { NodeInfo } from "@local/airdrop-sdk/node";
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
import { airdropClient, nodeClient } from "@/sdk";
import { ADMIN_CAP } from "@local/airdrop-sdk/utils";
import ConnectButton from "./components/ConnectButton";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import dayjs from "dayjs"; // 使用 dayjs 处理日期
import { formatTimestamp } from "../utils/time";
import { convertLargeToSmall, convertSmallToLarge } from "../utils/math";

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
  const account1 = account?.address;
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [editingAirdrop, setEditingAirdrop] = useState<AirdropInfo | null>(
    null,
  );
  const [showInviteModal, setShowInviteModal] = useState(false); // 控制邀请弹窗显示
  const [editreceiver, setEditreceiver] = useState(false);

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
      title: "总余额",
      dataIndex: "totalBalance",
      key: "totalBalance",
      render: (totalBalance: bigint) => convertSmallToLarge(totalBalance, 9),
    },
    {
      title: "是否开启",
      dataIndex: "isOpen",
      key: "isOpen",
      render: (isOpen: boolean) => (isOpen ? "开启" : "关闭"),
    },
    { title: "描述", dataIndex: "description", key: "description" },
    { title: "币种", dataIndex: "coinType", key: "coinType" },
    {
      title: "剩余金额",
      dataIndex: "remaining_balance",
      key: "remaining_balance",
      render: (remaining_balance: bigint) =>
        convertSmallToLarge(remaining_balance, 9),
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
              startTime: record.startTime,
              endTime: record.endTime,
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
      console.log("Airdrop list:", list);

      setAirdropList(list);
    } catch (error) {
      messageApi.error("获取空投列表失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 提款功能
  const handleWithdraw = async (round: bigint, coinType: string) => {
    if (!account1) {
      messageApi.error("请先连接钱包");
      return;
    }
    try {
      setLoading(true);
      const result = await airdropClient.withdraw(
        coinType,
        ADMIN_CAP,
        AIRDROPS,
        round,
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
    } catch (error) {
      messageApi.error("提取失败");
      console.error(" error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 新建空投功能
  const handleCreateAirdrop = async (values: any) => {
    try {
      if (!account1) {
        messageApi.error("请先连接钱包");
        return;
      }
      setLoading(true);

      // 将日期选择转换为毫秒级时间戳
      const startTime = dayjs(values.startTime).valueOf(); // 转换为毫秒级时间戳
      const endTime = dayjs(values.endTime).valueOf(); // 转换为毫秒级时间戳

      const {
        totalShares,
        totalBalance,
        description,
        image_url,
        amount,
        coinType,
      } = values;

      // 调用 airdropClient.insert 方法
      const result = await airdropClient.insert(
        coinType,
        ADMIN_CAP,
        AIRDROPS,
        BigInt(startTime), // 转换后的毫秒时间戳
        BigInt(endTime), // 转换后的毫秒时间戳
        BigInt(totalShares),
        BigInt(convertLargeToSmall(totalBalance, 9)),
        description,
        null, // 连接的钱包地址
        image_url,
        BigInt(convertLargeToSmall(amount, 9)),
        account1,
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
      messageApi.error("新建空投失败");
      console.error("Create Airdrop error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAirdrop = async (values: AirdropInfo) => {
    try {
      if (!editingAirdrop) return;
      const result = await airdropClient.modify(
        ADMIN_CAP,
        AIRDROPS,
        values.round,
        values.startTime,
        values.endTime,
        values.isOpen,
        values.description,
      );
      signAndExecuteTransaction(
        { transaction: result },
        {
          onSuccess: async (tx) => {
            console.log("空投更新成功:", tx.digest);
            messageApi.success("空投更新成功");
            setShowAirdropModal(false);
            fetchAirdropList(); // 更新节点列表
          },
          onError: ({ message }) => {
            console.error("空投更新失败:", message);
            messageApi.error("空投更新失败");
          },
        },
      );
    } catch (error) {
      messageApi.error("空投更新失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirdropList(); // 页面加载时获取空投列表
  }, []);

  // 节点表格列配置
  const nodeColumns = [
    { title: "等级", dataIndex: "rank", key: "rank" },
    { title: "称号", dataIndex: "name", key: "name" },
    { title: "描述", dataIndex: "description", key: "description" },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      render: (price: bigint) => convertSmallToLarge(price, 9),
    },
    { title: "数量限制", dataIndex: "limit", key: "limit" },
    { title: "总量", dataIndex: "total_quantity", key: "total_quantity" },

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
              price: record.price.toString(),
              limit: record.limit,
              total_quantity: record.total_quantity,
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
      const list = await nodeClient.nodeList(NODES);
      setNodeList(list);
    } catch (error) {
      messageApi.error("获取节点列表失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 新建节点功能
  const handleCreateNode = async (values: any) => {
    try {
      if (!account1) {
        messageApi.error("请先连接钱包");
        return;
      }
      setLoading(true);
      const { name, description, limit, price, total_quantity } = values;
      console.log("节点信息:", values);
      console.log("节点信息:", limit, price, total_quantity);
      const result = await airdropClient.insertNode(
        ADMIN_CAP,
        NODES,
        name,
        description,
        BigInt(limit),
        BigInt(convertLargeToSmall(price, 9)),
        BigInt(total_quantity),
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
      messageApi.error("新建节点失败");
      console.error("Create Node error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 修改节点信息
  const handleUpdateNode = async (values: NodeInfo) => {
    try {
      if (!editingNode) return;

      console.log("节点更新数据:", values.price);

      const priceBigInt = BigInt(convertLargeToSmall(values.price, 9) || 0); // 提供默认值
      console.log("节点更新数据:", values.price);

      const result = await airdropClient.modifyNode(
        ADMIN_CAP,
        NODES,
        values.rank,
        values.name,
        values.description,
        priceBigInt,
        values.limit,
        values.total_quantity,
      );
      signAndExecuteTransaction(
        { transaction: result },
        {
          onSuccess: async (tx) => {
            console.log("节点更新成功:", tx.digest);
            messageApi.success("节点更新成功");
            setShowNodeModal(false);
            fetchNodeList(); // 更新节点列表
          },
          onError: ({ message }) => {
            console.error("节点更新失败:", message);
            messageApi.error("节点更新失败");
          },
        },
      );
    } catch (error) {
      messageApi.error("节点更新失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirdropList();
    fetchNodeList();
  }, []);

  const handleinvite = async (value: any) => {
    try {
      const { fee, root } = value;

      const result = await airdropClient.modifyInvite(
        ADMIN_CAP,
        INVITE,
        root,
        fee,
      );
      signAndExecuteTransaction(
        { transaction: result },
        {
          onSuccess: async (tx) => {
            console.log("更新成功:", tx.digest);
            messageApi.success("更新成功");
            setShowInviteModal(false);
          },
          onError: ({ message }) => {
            console.error("更新失败:", message);
            messageApi.error("更新失败");
          },
        },
      );
    } catch (error) {
      messageApi.error("更新失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handlenode = async (value: any) => {
    try {
      const { receiver } = value;

      const result = await airdropClient.modify_nodes(
        ADMIN_CAP,
        NODES,
        receiver,
      );
      signAndExecuteTransaction(
        { transaction: result },
        {
          onSuccess: async (tx) => {
            console.log("修改接收人成功:", tx.digest);
            messageApi.success("修改接收人成功");
            setShowInviteModal(false);
          },
          onError: ({ message }) => {
            console.error("修改接收人失败:", message);
            messageApi.error("修改接收人失败");
          },
        },
      );
    } catch (error) {
      messageApi.error("修改接收人失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
                rules={[{ required: true, message: "请输入类型" }]}
              >
                <Input placeholder="请输入类型" />
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
                label="总余额"
                rules={[{ required: true, message: "请输入总余额" }]}
              >
                <Input type="number" placeholder="请输入总余额" />
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
              <Form.Item
                name="amount"
                label="金额"
                rules={[{ required: true, message: "请输入金额" }]}
              >
                <Input type="number" placeholder="请输入金额" />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  onClick={handleCreateAirdrop}
                >
                  创建空投
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="修改空投信息"
            visible={showAirdropModal}
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
                rules={[{ required: true, message: "请输入名称" }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
              <Form.Item
                name="description"
                label="描述"
                rules={[{ required: true, message: "请输入描述" }]}
              >
                <Input placeholder="请输入描述" />
              </Form.Item>
              <Form.Item
                name="limit"
                label="空投次数"
                rules={[{ required: true, message: "请输入空投次数" }]}
              >
                <Input type="number" placeholder="请输入空投次数" />
              </Form.Item>
              <Form.Item
                name="price"
                label="金额"
                rules={[{ required: true, message: "请输入金额" }]}
              >
                <Input type="number" placeholder="请输入金额" />
              </Form.Item>
              <Form.Item
                name="total_quantity"
                label="数量"
                rules={[{ required: true, message: "请输入总数量" }]}
              >
                <Input type="number" placeholder="请输入总数量" />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  onClick={handleCreateNode}
                >
                  创建节点{" "}
                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}></Form.Item>
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
                rules={[{ required: true, message: "请输入等级" }]}
              >
                <Input type="number" disabled />
              </Form.Item>

              <Form.Item
                name="name"
                label="称号"
                rules={[{ required: true, message: "请输入称号" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="description"
                label="描述"
                rules={[{ required: true, message: "请输入描述" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="price"
                label="价格"
                rules={[{ required: true, message: "请输入价格" }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="limit"
                label="数量"
                rules={[{ required: true, message: "请输入数量" }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                name="total_quantity"
                label="总量"
                rules={[{ required: true, message: "请输入总量" }]}
              >
                <Input type="number" />
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
        <Button
          type="primary"
          onClick={() => setShowInviteModal(true)} // 点击按钮显示弹窗
          style={{ marginBottom: "20px" }}
        >
          修改分红
        </Button>
        <Modal
          title="修改分红"
          visible={showInviteModal}
          onCancel={() => setShowInviteModal(false)} // 关闭弹窗
          footer={null} // 关闭默认按钮
        >
          <Form
            form={form}
            onFinish={handleinvite} // 提交表单
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              name="root"
              label="根节点"
              rules={[{ required: true, message: "请输入根节点" }]}
            >
              <Input placeholder="请输入根节点" />
            </Form.Item>
            <Form.Item
              name="inviter_fee"
              label="比例"
              rules={[{ required: true, message: "请输入比例" }]}
            >
              <Input type="number" placeholder="请输入比例" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                onClick={handleinvite}
              >
                修改分红{" "}
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}></Form.Item>
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div className="flex flex-col gap-4 overflow-x-auto">
        <Button
          type="primary"
          onClick={() => setEditreceiver(true)} // 点击按钮显示弹窗
          style={{ marginBottom: "20px" }}
        >
          修改接收人
        </Button>
        <Modal
          title="修改接收人"
          visible={editreceiver}
          onCancel={() => setEditreceiver(false)} // 关闭弹窗
          footer={null} // 关闭默认按钮
        >
          <Form
            form={form}
            onFinish={handlenode} // 提交表单
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
          >
            <Form.Item
              name="receiver"
              label="接收人"
              rules={[{ required: true, message: "请输入接收人" }]}
            >
              <Input placeholder="请输入接收人" />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                onClick={handleinvite}
              >
                修改接收人{" "}
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}></Form.Item>
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};
export default AdminPage;
