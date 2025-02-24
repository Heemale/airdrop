'use client';

import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import { authProvider } from '@/config/authProvider';
import { dataProvider } from '@/config/dataProvider';
import Dashboard from '@/components/Dashboard';
import Layout from '@/components/Layout';
import UserList from '@/components/page/user/UserList';
import UserEdit from '@/components/page/user/UserEdit';
import CopywritingList from '@/components/page/copywriting/CopyrightingtList';
import CopywritingEdit from '@/components/page/copywriting/CopywritingEdit';
import AirdropList from '@/components/page/airdrop/AirdropList';
import ClaimRecordList from '@/components/page/airdrop/ClaimRecordList';
import GlobalList from '@/components/page/global/GlobalList';
import LimitList from '@/components/page/limit/LimitList';
import BuyRecordList from '@/components/page/node/BuyRecordList';
import NodeList from '@/components/page/node/NodeList';
import TransferRecordList from '@/components/page/user/TransferRecordList';
import NodeEdit from '@/components/page/node/NodeEdit';

const AdminApp = () => (
  <Admin
    dataProvider={dataProvider}
    dashboard={Dashboard}
    layout={Layout}
    authProvider={authProvider}
  >
    <Resource
      name="users"
      options={{ label: '用户表' }}
      list={UserList}
      edit={UserEdit}
    />
    <Resource
      name="nodes"
      options={{ label: '权益表' }}
      list={NodeList}
      edit={NodeEdit}
    />
    <Resource
      name="airdrops"
      options={{ label: '空投表' }}
      list={AirdropList}
      edit={EditGuesser}
    />
    <Resource
      name="buy-records"
      options={{ label: '购买记录表' }}
      list={BuyRecordList}
      edit={EditGuesser}
    />
    <Resource
      name="transfer-records"
      options={{ label: '转移记录表' }}
      list={TransferRecordList}
      edit={EditGuesser}
    />
    <Resource
      name="claim-records"
      options={{ label: '领取记录表' }}
      list={ClaimRecordList}
      edit={EditGuesser}
    />
    <Resource
      name="special-limits"
      options={{ label: '特殊限制表' }}
      list={LimitList}
      edit={EditGuesser}
    />
    <Resource
      name="objects"
      options={{ label: '项目对象表' }}
      list={GlobalList}
      edit={EditGuesser}
    />
    <Resource
      name="media-configs"
      options={{ label: '文案表' }}
      list={CopywritingList}
      edit={CopywritingEdit}
    />
  </Admin>
);

export default AdminApp;
