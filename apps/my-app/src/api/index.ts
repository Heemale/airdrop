import request from "@/utils/request";
import { GetNodeInfoRequest } from "@/api/types/request";
import { NodeInfoResponse } from "@/api/types/response";

export const getNodeInfo = (
  params: GetNodeInfoRequest,
): Promise<NodeInfoResponse> => request.get("/all-nodes", { params });
