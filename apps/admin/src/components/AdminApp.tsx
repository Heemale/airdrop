'use client';

import { Admin, Resource } from 'react-admin';
import { authProvider } from '@/config/authProvider';
import { dataProvider } from '@/config/dataProvider';
import Dashboard from '@/components/Dashboard';
import Layout from '@/components/Layout';
import UserList from '@/components/page/user/UserList';
import UserEdit from '@/components/page/user/userEdit';
import NodeList from '@/components/page/node/NodeList';
import NodeShow from '@/components/page/node/NodeShow';
import MediaConfigShow from '@/components/page/media-config/MediaConfigShow';
import UserShow from '@/components/page/user/UserShow';
import LimitShow from '@/components/page/limit/LimitShow';
import ClaimRecordShow from './page/claim-record/ClaimRecordShow';
import GlobalShow from './page/global/GlobalShow';
import NodeEdit from '@/components/page/node/NodeEdit';
import NodeCreate from '@/components/page/node/NodeCreate';
import AirdropList from '@/components/page/airdrop/AirdropList';
import AirdropEdit from '@/components/page/airdrop/AirdropEdit';
import AirdropCreate from '@/components/page/airdrop/AirdropCreate';
import AirdropShow from '@/components/page/airdrop/AirdropShow';
import BuyRecordList from '@/components/page/buy-record/BuyRecordList';
import BuyRecordShow from '@/components/page/buy-record/BuyRecordShow';
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
import ChangePassword from '@/components/page/change-password/ChangePassword';
import ReceiverEdit from '@/components/page/change-receiver/ReceiverEdit';
import InviteFeeEdit from '@/components/page/change-inviter-fee/InviteFeeEdit';

import {
  People,
  AccountTree,
  CardGiftcard,
  Article,
  LockPerson,
  Widgets,
  AttachMoney,
  Assignment,
  Security,
} from '@mui/icons-material';
import { i18nProvider } from '@/config/i18nProvider';

const AdminApp = () => (
  <div className="w-full overflow-x-auto md:overflow-x-visible md:max-w-none">
    <Admin
      dataProvider={dataProvider}
      dashboard={Dashboard}
      layout={Layout}
      authProvider={authProvider}
      i18nProvider={i18nProvider}
    >
      <Resource
        name="nodes"
        options={{ label: '权益表' }}
        list={NodeList}
        edit={NodeEdit}
        create={NodeCreate}
        show={NodeShow}
        icon={AccountTree}
      />
      <Resource
        name="airdrops"
        options={{ label: '空投表' }}
        list={AirdropList}
        edit={AirdropEdit}
        create={AirdropCreate}
        show={AirdropShow}
        icon={CardGiftcard}
      />
      <Resource
        name="media-configs"
        options={{ label: '文案表' }}
        list={MediaConfigList}
        edit={MediaConfigEdit}
        show={MediaConfigShow}
        icon={Article}
      />
      <Resource
        name="users"
        options={{ label: '用户表' }}
        list={UserList}
        edit={UserEdit}
        show={UserShow}
        icon={People}
      />
      <Resource
        name="user-hierarchy"
        options={{ label: '用户层级结构' }}
        list={UserHierarchy}
        icon={AccountTree}
      />
      <Resource
        name="special-limits"
        options={{ label: '特殊限制表' }}
        list={LimitList}
        edit={LimitEdit}
        create={LimitCreate}
        show={LimitShow}
        icon={LockPerson}
      />
      <Resource
        name="objects"
        options={{ label: '项目对象表' }}
        list={GlobalList}
        edit={GlobalEdit}
        create={GlobalCreate}
        show={GlobalShow}
        icon={Widgets}
      />
      <Resource
        name="buy-records"
        options={{ label: '购买记录' }}
        list={BuyRecordList}
        show={BuyRecordShow}
        icon={AttachMoney}
      />
      <Resource
        name="claim-records"
        options={{ label: '领取记录' }}
        list={ClaimRecordList}
        show={ClaimRecordShow}
        icon={Assignment}
      />
      <Resource
        name="change-password"
        options={{ label: '修改密码' }}
        list={ChangePassword}
        icon={Security}
      />
      <Resource
        name="change-receiver"
        options={{ label: '修改资金接收人' }}
        list={ReceiverEdit}
        icon={Security}
      />
      <Resource
        name="change-inviter-fee"
        options={{ label: '修改分红费率' }}
        list={InviteFeeEdit}
        icon={Security}
      />
    </Admin>
  </div>
);

export default AdminApp;
