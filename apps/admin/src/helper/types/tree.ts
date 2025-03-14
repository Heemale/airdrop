export interface TreeNode<T = any> {
  id: number;
  label: string;
  data: T; // 原始数据
  children?: Array<TreeNode<T>>;
  hasChildren?: boolean; // 是否还有未加载的子节点
  isLoading?: boolean; // 加载状态
  isExpanded?: boolean; // 展开状态
}
