import request from '@/utils/request';

export const getUserInfo = () => request.get('user/info');

export const getUserShares = () => request.get('user/shares');

export const getBuyNodeRecord = (params: { sender: string }) =>
  request.get('buy-node-record', { params });

export const getClaimAirdropRecord = (params: {
  sender: string;
  nextCursor?: number;
  pageSize?: number;
}) => request.get('claim-airdrop-record', { params });
