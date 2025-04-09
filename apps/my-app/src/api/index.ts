import request from '@/utils/request';
import {
  NodeInfoResponse,
  RootNode,
  SubordinateNode,
} from '@/api/types/response';
export const getNodeInfo = (): Promise<NodeInfoResponse> =>
  request.get('api/nodes/all-nodes');

export const getChildren = (): Promise<RootNode> =>
  request.get('api/user/children');
export const getUserInfo = (address: string): Promise<SubordinateNode> =>
  request.get(`api/user/address/${address}/children`);
