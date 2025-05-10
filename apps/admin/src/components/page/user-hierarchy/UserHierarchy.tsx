import { getTree, getUserByAddress } from '@/api';
import { Tree } from '@/api/types/response';
import Copy from '@/components/helper/Copy';
import { Button, TextField } from '@mui/material';
import { formatAddress } from '@mysten/sui/utils';
import { useEffect, useState } from 'react';
import { useNotify } from 'react-admin';

const treeStyles = {
  nodeContainer: {
    position: 'relative' as const,
    marginLeft: '30px', // 增加左侧边距以容纳连接线
    paddingTop: '10px', // 增加顶部边距
  },
  verticalLine: {
    position: 'absolute' as const,
    left: '-15px', // 调整到节点左侧
    top: '0', // 从节点顶部开始
    bottom: '-10px', // 延伸到子节点区域
    width: '1px',
    backgroundColor: '#ccc',
  },
  horizontalLine: {
    position: 'absolute' as const,
    left: '-15px', // 从垂直连接线开始
    top: '35px', // 调整水平连接线位置
    width: '15px',
    height: '1px',
    backgroundColor: '#ccc',
  },
  rootNodeContainer: {
    marginLeft: '0', // 根节点不需要左侧边距
  },
  contentWrapper: {
    position: 'relative' as const,
    padding: '8px 0',
  },
  buttons: {
    marginLeft: '8px',
    padding: '4px 8px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export interface TreeNode {
  id: string;
  address: string;
  childrenIds?: string[];
  children?: TreeNode[];
  hasFetched?: boolean;
}

export const updateTree = (
  nodes: TreeNode[],
  targetId: string,
  updater: (node: TreeNode) => TreeNode,
): TreeNode[] => {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return updater(node);
    } else if (node.children) {
      return {
        ...node,
        children: updateTree(node.children, targetId, updater),
      };
    } else {
      return node;
    }
  });
};

const UserHierarchy = () => {
  const notify = useNotify();

  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [searchAddress, setSearchAddress] = useState('');

  const loadNodeData = async (id?: string) => {
    try {
      const list = id ? await getTree({ ids: [Number(id)] }) : await getTree();
      updateTreeData(list);

      if (list.length === 1 && list[0].sharerIds.length === 0) {
        notify('没有更多下级', { type: 'info' });
        return;
      }
      notify('获取数据成功', { type: 'info' });
    } catch (e: any) {
      notify('更新数据失败', { type: 'error' });
    }
  };

  const handleAddressSearch = async () => {
    if (!searchAddress) return;

    try {
      const user = await getUserByAddress({ address: searchAddress });
      if (!user) {
        notify('未找到该用户', { type: 'error' });
        return;
      }
      notify('获取数据成功', { type: 'info' });

      setTreeData([]);
      updateTreeData([user]);
    } catch (e: any) {
      notify('获取用户信息失败', { type: 'error' });
      return;
    }
  };

  const handleRootAddressSearch = async () => {
    try {
      const users = await getTree();
      notify('获取数据成功', { type: 'info' });

      setTreeData([]);
      updateTreeData(users);
    } catch (e: any) {
      notify('更新数据失败', { type: 'error' });
      return;
    }
  };

  const updateTreeData = (list: Tree[]) => {
    try {
      list.map((data) => {
        const id = data.id.toString();
        setTreeData((prevTree) => {
          let nodeExists = false;
          const checkExists = (nodes: TreeNode[]): boolean =>
            nodes.some((node) => {
              if (node.id === id) {
                nodeExists = true;
                return true;
              }
              return node.children ? checkExists(node.children) : false;
            });

          checkExists(prevTree);

          if (!nodeExists) {
            const newNode: TreeNode = {
              id,
              address: data.address,
              childrenIds: data.sharerIds.map(String),
              children: data.sharerIds.map((childId) => ({
                id: String(childId),
                address: '',
                childrenIds: [],
                hasFetched: false,
              })),
              hasFetched: true,
            };
            return [...prevTree, newNode];
          } else {
            return updateTree(prevTree, id, (node) => {
              const existingChildrenMap = new Map<string, TreeNode>();
              node.children?.forEach((child) =>
                existingChildrenMap.set(child.id, child),
              );

              const newChildren = data.sharerIds.map((childId) => {
                const idStr = String(childId);
                return (
                  existingChildrenMap.get(idStr) || {
                    id: idStr,
                    address: '',
                    childrenIds: [],
                    hasFetched: false,
                  }
                );
              });

              return {
                ...node,
                address: data.address,
                childrenIds: data.sharerIds.map(String),
                children: newChildren,
                hasFetched: true,
              };
            });
          }
        });

        setExpanded((prev) => [...prev, id]);
      });
    } catch (e: any) {
      notify('更新数据失败', { type: 'error' });
    }
  };

  const renderTree = (nodes: TreeNode[], isRoot = false) => {
    return nodes.map((node, index, array) => {
      const isExpanded = expanded.includes(node.id);
      const isLastNode = index === array.length - 1;

      return (
        <div
          key={node.id}
          style={{
            ...treeStyles.nodeContainer,
            ...(isRoot ? treeStyles.rootNodeContainer : {}),
          }}
          className="tree-node"
        >
          {/* 垂直连接线 */}
          {!isRoot && (
            <div
              style={{
                ...treeStyles.verticalLine,
                bottom: isLastNode ? '15px' : '-10px', // 最后一个节点的垂直连接线缩短
              }}
            />
          )}

          {/* 水平连接线 */}
          {!isRoot && <div style={treeStyles.horizontalLine} />}

          <div style={treeStyles.contentWrapper}>
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span
                style={{
                  fontWeight: 600,
                  color: node.address ? '#333' : '#999',
                }}
              >
                {node.address ? (
                  <div className="flex gap-1">
                    <Copy text={node.address} render={formatAddress} />
                    (ID: {node.id})
                  </div>
                ) : (
                  `未加载节点 (ID: ${node.id})`
                )}
              </span>

              <button
                onClick={() => loadNodeData(node.id)}
                style={treeStyles.buttons}
              >
                刷新
              </button>

              {node.childrenIds && node.childrenIds.length > 0 && (
                <button
                  onClick={() => {
                    if (!node.hasFetched) {
                      loadNodeData(node.id);
                    }
                    setExpanded((prev) =>
                      prev.includes(node.id)
                        ? prev.filter((e) => e !== node.id)
                        : [...prev, node.id],
                    );
                  }}
                  style={{
                    ...treeStyles.buttons,
                    backgroundColor: isExpanded ? '#e0e0e0' : '#f0f0f0',
                  }}
                >
                  {isExpanded ? '收起 ▼' : '展开 ▶'}
                </button>
              )}
            </span>

            {isExpanded && node.children && (
              <div style={{ position: 'relative' }}>
                {renderTree(node.children)}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    loadNodeData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex flex-col gap-3">
        <Button variant="contained" onClick={handleRootAddressSearch} fullWidth>
          获取根用户
        </Button>
        <TextField
          id="address"
          label="用户地址"
          variant="outlined"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddressSearch} fullWidth>
          搜索
        </Button>
      </div>
      <div className="mt-4">{renderTree(treeData)}</div>
    </div>
  );
};

export default UserHierarchy;
