export class RootUserResponse {
  id: number;
  address: string;
  shareIds: number[]; // 直接下级ID列表
  isRoot: boolean;
}
