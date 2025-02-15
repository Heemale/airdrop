'use client';

import { Admin, Resource, ListGuesser, EditGuesser } from 'react-admin';
import Dashboard from '@/components/Dashboard';
import { dataProvider } from 'ra-data-simple-prisma';
import { UserList } from '@/components/page/user/UserList';
import { UserEdit } from '@/components/page/user/UserEdit';

const AdminApp = () => (
  <Admin dataProvider={dataProvider('/api')} dashboard={Dashboard}>
    <Resource
      name="user"
      options={{ label: '用户表' }}
      list={UserList}
      edit={UserEdit}
    />
  </Admin>
);

export default AdminApp;
