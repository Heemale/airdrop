import request from "@/utils/request";
import { NodeInfoResponse, RootNode } from "@/api/types/response";
export const getNodeInfo = (): Promise<NodeInfoResponse> =>
  request.get("/all-nodes");

export const getChildren = (): Promise<RootNode> =>
  request.get("/user/children");
