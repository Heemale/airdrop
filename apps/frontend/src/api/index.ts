import request from '@/utils/request';

export const getUserInfo = () => request.get('/user');

export const getTeamInfo = () => request.get('/team');

// 修改 getBuyInfo 函数以接受 sender 参数
export const getBuyInfo = (sender: string) =>
  request.get('/buy-node-record', {
    params: { sender }, // 传递 sender 参数
  });
export const getClaimInfo = (address: string,currentCursor:number) =>
  request.get('api/claim-airdrop-record/info', {
    params: { address ,currentCursor},
  });
