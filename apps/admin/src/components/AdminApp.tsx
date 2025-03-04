'use client';

import { Admin, Resource } from 'react-admin';
import { authProvider } from '@/config/authProvider';
import { dataProvider } from '@/config/dataProvider';
import Dashboard from '@/components/Dashboard';
import Layout from '@/components/Layout';
import UserList from '@/components/page/user/UserList';
import UserEdit from '@/components/page/user/userEdit';
import NodeList from '@/components/page/node/NodeList';
import NodeEdit from '@/components/page/node/NodeEdit';
import NodeCreate from '@/components/page/node/NodeCreate';
import AirdropList from '@/components/page/airdrop/AirdropList';
import AirdropEdit from '@/components/page/airdrop/AirdropEdit';
import AirdropCreate from '@/components/page/airdrop/AirdropCreate';
import BuyRecordList from '@/components/page/buy-record/BuyRecordList';
import TransferRecordList from '@/components/page/transfer-record/TransferRecordList';
import ClaimRecordList from '@/components/page/claim-record/ClaimRecordList';
import LimitList from '@/components/page/limit/LimitList';
import LimitEdit from '@/components/page/limit/LimitEdit';
import LimitCreate from '@/components/page/limit/LimitCreate';
import GlobalList from '@/components/page/global/GlobalList';
import GlobalEdit from '@/components/page/global/GlobalEdit';
import GlobalCreate from '@/components/page/global/GlobalCreate';
import MediaConfigList from '@/components/page/media-config/MediaConfigList';
import MediaConfigEdit from '@/components/page/media-config/MediaConfigEdit';
import UserHierarchy from '@/components/page/user-hierarchy/UserHierarchy';

const AdminApp = () => (
  <div className="w-full overflow-x-auto md:overflow-x-visible md:max-w-none">
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
        create={NodeCreate}
      />
      <Resource
        name="airdrops"
        options={{ label: '空投表' }}
        list={AirdropList}
        edit={AirdropEdit}
        create={AirdropCreate}
      />
      <Resource
        name="buy-records"
        options={{ label: '购买记录表' }}
        list={BuyRecordList}
      />
      <Resource
        name="transfer-records"
        options={{ label: '转移记录表' }}
        list={TransferRecordList}
      />
      <Resource
        name="claim-records"
        options={{ label: '领取记录表' }}
        list={ClaimRecordList}
      />
      <Resource
        name="special-limits"
        options={{ label: '特殊限制表' }}
        list={LimitList}
        edit={LimitEdit}
        create={LimitCreate}
      />
      <Resource
        name="objects"
        options={{ label: '项目对象表' }}
        list={GlobalList}
        edit={GlobalEdit}
        create={GlobalCreate}
      />
      <Resource
        name="media-configs"
        options={{ label: '文案表' }}
        list={MediaConfigList}
        edit={MediaConfigEdit}
      />
      <Resource
        name="user-hierarchy"
        options={{ label: '用户层级结构' }}
        list={UserHierarchy}
      />
    </Admin>
  </div>
);

export default AdminApp;
