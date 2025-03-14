import * as React from 'react';
import Box from '@mui/material/Box';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useEffect, useState } from 'react';
import { getTeamInfo } from '@/api';
import { Avatar, Button, styled } from '@mui/material';
import { formatAddress } from '@mysten/sui/utils';
import {
  TreeItem2Checkbox,
  TreeItem2Content,
  TreeItem2GroupTransition,
  TreeItem2Icon,
  TreeItem2IconContainer,
  TreeItem2Label,
  TreeItem2Provider,
  TreeItem2Root,
  useTreeItem2,
  UseTreeItem2Parameters,
} from '@mui/x-tree-view';

const MUI_X_PRODUCTS: TreeViewBaseItem[] = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [
      {
        id: '1',
        label: '@mui/x-tree-view',
        children: [
          {
            id: '2',
            label: 'Tree View',
          },
        ],
      },
    ],
  },
];

export interface CustomTreeItemProps
  extends Omit<UseTreeItem2Parameters, 'rootRef'>,
    Omit<React.HTMLAttributes<HTMLLIElement>, 'onFocus'> {}

// 树节点扩展类型
interface ExtendedTreeItem extends TreeViewBaseItem {
  children?: ExtendedTreeItem[];
  sharerIds?: Array<number>;
  hasFetched?: boolean; // 是否已获取过子节点
}

export const CustomTreeItemContent = styled(TreeItem2Content)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
}));

// 递归查找节点
const findNode = (
  nodes: ExtendedTreeItem[],
  targetId: string,
): ExtendedTreeItem | undefined => {
  for (const node of nodes) {
    if (node.id === targetId) return node;
    if (node.children) {
      const found = findNode(node.children, targetId);
      if (found) return found;
    }
  }
};

const UserTree = () => {
  const [treeData, setTreeData] = useState<ExtendedTreeItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [lastSelectedItem, setLastSelectedItem] = React.useState<string | null>(
    null,
  );

  const getAllItemsWithChildrenItemIds = () => {
    const itemIds: TreeViewItemId[] = [];
    const registerItemId = (item: TreeViewBaseItem) => {
      if (item.children?.length) {
        itemIds.push(item.id);
        item.children.forEach(registerItemId);
      }
    };

    treeData.forEach(registerItemId);

    return itemIds;
  };

  const CustomTreeItem = React.forwardRef(function CustomTreeItem(
    props: CustomTreeItemProps,
    ref: React.Ref<HTMLLIElement>,
  ) {
    const { id, itemId, label, disabled, children, ...other } = props;

    const {
      getRootProps,
      getContentProps,
      getIconContainerProps,
      getCheckboxProps,
      getLabelProps,
      getGroupTransitionProps,
      status,
    } = useTreeItem2({ id, itemId, children, label, disabled, rootRef: ref });

    return (
      <TreeItem2Provider itemId={itemId}>
        <TreeItem2Root {...getRootProps(other)}>
          <CustomTreeItemContent {...getContentProps()}>
            <TreeItem2IconContainer {...getIconContainerProps()}>
              <TreeItem2Icon status={status} />
            </TreeItem2IconContainer>
            <TreeItem2Checkbox {...getCheckboxProps()} />
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              <Avatar
                sx={(theme) => ({
                  background: theme.palette.primary.main,
                  width: 24,
                  height: 24,
                  fontSize: '0.8rem',
                })}
                onClick={async () => {
                  await updateTeamInfo(itemId);
                }}
              >
                {(label as string)[0]}
              </Avatar>
              <TreeItem2Label {...getLabelProps()} />
            </Box>
          </CustomTreeItemContent>
          {children && (
            <TreeItem2GroupTransition {...getGroupTransitionProps()} />
          )}
        </TreeItem2Root>
      </TreeItem2Provider>
    );
  });

  const handleExpandedItemsChange = (
    _event: React.SyntheticEvent,
    itemIds: string[],
  ) => {
    setExpandedItems(itemIds);
  };

  const handleExpandClick = () => {
    setExpandedItems((oldExpanded) =>
      oldExpanded.length === 0 ? getAllItemsWithChildrenItemIds() : [],
    );
  };

  const handleItemSelectionToggle = (
    _event: React.SyntheticEvent,
    itemId: string,
    isSelected: boolean,
  ) => {
    if (isSelected) {
      setLastSelectedItem(itemId);
    }
  };

  // 更新树数据
  const updateTreeData = (
    parentId: string | null,
    newItems: ExtendedTreeItem[],
  ) => {
    setTreeData((prev) => {
      const newTree = [...prev];
      const existingIds = new Set(newTree.map((n) => n.id));

      // 处理每个新节点
      newItems.forEach((item) => {
        if (!existingIds.has(item.id)) {
          newTree.push(item);
          existingIds.add(item.id);
        }
      });

      // 建立父子关系
      newItems.forEach((item) => {
        // 如果是通过父节点加载的，直接挂载
        if (parentId) {
          // TODO 在父级下追加节点同时补上父级的地址
          // const parent = findNode(newTree, parentId);
          // if (parent && !parent.children?.some((c) => c.id === item.id)) {
          //   parent.children = [...(parent.children || []), item];
          // }
        } else {
          // 处理根节点：找到所有父节点并挂载
          const parents = newTree.filter((node) =>
            item?.sharerIds?.includes(parseInt(node.id)),
          );
          parents.forEach((parent) => {
            if (!parent.children?.some((c) => c.id === item.id)) {
              parent.children = [...(parent.children || []), item];
            }
          });
        }
      });

      return newTree;
    });
  };

  // 获取团队数据
  const updateTeamInfo = async (parentId: string | null) => {
    try {
      const ids = parentId ? [parseInt(parentId)] : null;
      const teamInfo = await getTeamInfo({ ids });

      if (!teamInfo[0].sharerIds) {
        return [];
      }

      const handledData: ExtendedTreeItem[] = !parentId
        ? teamInfo.map((item) => {
            return {
              id: item.id.toString(),
              label: `${item.id.toString()} ${formatAddress(item.address)}`,
              children: item.sharerIds?.length
                ? item.sharerIds.map((item) => {
                    return {
                      id: item.toString(),
                      label: item.toString(),
                      children: [],
                      sharerIds: [],
                      hasFetched: false,
                    };
                  })
                : undefined,
              sharerIds: item.sharerIds,
              hasFetched: false,
            };
          })
        : teamInfo[0].sharerIds.map((item) => {
            return {
              id: item.toString(),
              label: `${item.toString()}`,
              children: [],
              sharerIds: [],
              hasFetched: false,
            };
          });
      updateTreeData(parentId, handledData);
    } catch (err) {
      console.error('Failed to load team info:', err);
    }
  };

  useEffect(() => {
    updateTeamInfo(null);
  }, []);

  return (
    <>
      <div>
        <Button onClick={handleExpandClick}>
          {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
        </Button>
      </div>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={treeData}
          expandedItems={expandedItems}
          onExpandedItemsChange={handleExpandedItemsChange}
          onItemSelectionToggle={handleItemSelectionToggle}
          slots={{ item: CustomTreeItem }}
        />
      </Box>
    </>
  );
};

export default UserTree;
