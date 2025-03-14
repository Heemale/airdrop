export interface ChangePasswordDto {
  newPassword: string;
}

// 子节点类型（递归结构）
export interface SubordinateNode {
  id: number;
  address: string | null;
  children: SubordinateNode[]; // 递归子节点
}

// 根节点类型
export interface RootNode {
  rootAddresses: string[]; // 根用户的地址数组
  children: SubordinateNode[]; // 根节点的子节点数组
}

export interface GetTeamInfoDto {
  ids: Array<number> | null;
}

export interface TeamInfo {
  id: number;
  address: string;
  sharerIds: Array<number>;
}
