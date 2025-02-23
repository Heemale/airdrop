'use client';

import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import Dashboard from '@/components/Dashboard';
import Layout from '@/components/Layout';
import UserList from '@/components/page/user/UserList';
import CopywritingList from '@/components/page/copywriting/CopyrightingtList';
import CopywritingEdit from '@/components/page/copywriting/CopywritingEdit';
import { authProvider } from '@/config/authProvider';
import { dataProvider } from '@/config/dataProvider';

const AdminApp = () => (
  <Admin
    dataProvider={dataProvider}
    dashboard={Dashboard}
    layout={Layout}
    authProvider={authProvider}
  >
    <Resource name="users" options={{ label: '用户表' }} list={UserList} />
    <Resource
      name="nodes"
      options={{ label: '权益表' }}
      list={ListGuesser}
      edit={EditGuesser}
    />
    <Resource
      name="airdrops"
      options={{ label: '空投表' }}
      list={ListGuesser}
      edit={EditGuesser}
    />
    <Resource
      name="buy-records"
      options={{ label: '购买记录表' }}
      list={ListGuesser}
      edit={EditGuesser}
    />
    <Resource
      name="transfer-records"
      options={{ label: '转移记录表' }}
      list={ListGuesser}
      edit={EditGuesser}
    />
    <Resource
      name="claim-records"
      options={{ label: '领取记录表' }}
      list={ListGuesser}
      edit={EditGuesser}
    />
    <Resource
      name="special-limits"
      options={{ label: '特殊限制表' }}
      list={ListGuesser}
      edit={EditGuesser}
    />
    <Resource
      name="objects"
      options={{ label: '项目对象表' }}
      list={ListGuesser}
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
