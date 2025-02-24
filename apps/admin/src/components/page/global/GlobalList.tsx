import MyDatagridConfigurable from '@/components/ui/MyDatagridConfigurable';
import { BooleanField, List, TextField, TextInput } from 'react-admin';
import * as React from 'react';

const postFilters = [
  <TextInput key="id" name="id" source="id" label="ID" />,
  <TextInput key="object" name="object" source="object" label="对象ID" />,
  <TextInput key="isValid" name="isValid" source="isValid" label="是否合法" />,
];

const GlobalList = () => (
  <List filters={postFilters}>
    <MyDatagridConfigurable>
      <TextField source="id" label="ID" />
      <TextField source="object" label="对象ID" />
      <BooleanField source="isValid" label="是否合法" />
    </MyDatagridConfigurable>
  </List>
);

export default GlobalList;
