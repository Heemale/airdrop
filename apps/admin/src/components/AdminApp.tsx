'use client';

import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import { dataProvider } from 'ra-data-simple-prisma';
import Dashboard from '@/components/Dashboard';
import Layout from '@/components/Layout';
import UserList from '@/components/page/user/UserList';
import CopywritingList from '@/components/page/copywriting/CopyrightingtList';
import CopywritingEdit from '@/components/page/copywriting/CopywritingEdit';
import { authProvider } from '@/config/authProvider';

const AdminApp = () => (
  <Admin
    dataProvider={dataProvider('/api')}
    dashboard={Dashboard}
    layout={Layout}
    authProvider={authProvider}
  >
    <Resource name="user" options={{ label: '用户表' }} list={UserList} />
    <Resource
      name="copywriting"
      options={{ label: '文案表' }}
      list={CopywritingList}
      edit={CopywritingEdit}
    />
  </Admin>
);

export default AdminApp;
