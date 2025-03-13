import React, { useState, useEffect } from 'react';
import { RootNode, SubordinateNode } from '@/api/types';
import { getChildren } from '@/api';
import { message } from 'antd';
import { getUserInfo } from '@/api';
import { handleDevTxError } from '../../../sdk/error';

// 树节点样式
const treeNodeStyle = {
  marginLeft: '20px',
  padding: '4px 0',
  cursor: 'pointer',
};

const nodeHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const toggleButtonStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  color: '#666',
};

// 递归渲染树的组件
const RenderTree: React.FC<{ nodes: SubordinateNode[]; depth?: number }> = ({
  nodes,
  depth = 0,
}) => {
  return (
    <ul style={{ listStyle: 'none', paddingLeft: `${depth * 20}px` }}>
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} depth={depth} />
      ))}
    </ul>
  );
};

// 渲染单个树节点的组件
const TreeNode: React.FC<{ node: SubordinateNode; depth: number }> = ({
  node,
  depth,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <li style={treeNodeStyle}>
      <div style={nodeHeaderStyle}>
        {node.children && node.children.length > 0 && (
          <button onClick={handleToggle} style={toggleButtonStyle}>
            {isOpen ? '▼' : '►'}
          </button>
        )}
        <span>{node.address ?? 'children'}</span>
      </div>

      {isOpen && node.children && node.children.length > 0 && (
        <RenderTree nodes={node.children} depth={depth + 1} />
      )}
    </li>
  );
};

// 根组件，接收数据并渲染整个树
export const TreeStructure: React.FC<{ data: RootNode[] }> = ({ data }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '16px' }}>
      {data.map((rootNode, index) => (
        <div key={index}>
          <h3>Root Addresses:</h3>
          <pre>{rootNode.rootAddresses.join('\n')}</pre>
          {rootNode.children && rootNode.children.length > 0 && (
            <RenderTree nodes={rootNode.children} depth={1} />
          )}
        </div>
      ))}
    </div>
  );
};

const UserHierarchy = () => {
  const [treeData, setTreeData] = useState<RootNode[]>([]);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [treeData1, setTreeData1] = useState<RootNode[]>([]);
  const [messageApi, contextHolder] = message.useMessage();
  const getChildrens = async (): Promise<RootNode[]> => {
    const rootNode = await getChildren();
    return [rootNode];
  };

  const fetchData = async () => {
    const childrenData = await getChildrens();
    setTreeData(childrenData);
  };
  const handleSearch = async () => {
    if (!address) return;
    setLoading(true);

    try {
      const data = await getUserInfo(address);
      const rootNode: RootNode[] = [
        {
          rootAddresses: [address],
          children: Array.isArray(data) ? data : [data],
        },
      ];

      setTreeData1(rootNode);
    } catch (e: any) {
      messageApi.error(handleDevTxError(e.message.trim()));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <TreeStructure data={treeData} />
      <div>
        {contextHolder}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="请输入地址"
            className="flex-1 rounded border p-2"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
          >
            {loading ? '加载中...' : '搜索'}
          </button>
        </div>

        {treeData1.length > 0 && <TreeStructure data={treeData1} />}
      </div>
    </div>
  );
};

export default UserHierarchy;
