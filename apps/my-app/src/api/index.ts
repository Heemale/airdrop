import request from "@/utils/request";
import { NodeInfoResponse } from "@/api/types/response";

export const getNodeInfo = (): Promise<NodeInfoResponse> =>
  request.get("/all-nodes");
