import { User } from './types/user';
import { TreeNode } from '@/helper/types/tree';

export const buildTree = (
  users: Array<User>,
  parentKey: keyof User = 'sharerIds',
): Array<TreeNode<User>> => {
  const map = new Map<number, TreeNode<User>>();

  // 创建基础节点
  users.forEach((user) => {
    map.set(user.id, {
      id: user.id,
      label: user.address || `User ${user.id}`,
      data: user,
      hasChildren: false, // 初始状态
      children: [],
    });
  });

  // 建立层级关系
  return users.reduce<Array<TreeNode<User>>>((acc, user) => {
    const node = map.get(user.id)!;
    const parentId = user[parentKey].toString();

    if (parentId) {
      const ids = parentId.split(',').map(Number);
      ids.forEach((id) => {
        const parent = map.get(id)!;
        parent.children!.push(node);
        parent.hasChildren = true;
      });
    } else {
      acc.push(node);
    }

    return acc;
  }, []);
};
