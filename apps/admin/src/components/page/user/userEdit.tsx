import { BooleanInput, Edit, SimpleForm, TextInput } from 'react-admin';
import React from 'react';
import CreateEditActions from '@/components/ui/CreateEditActions';

const UserEdit = () => {
  const transform = async (data: any) => {
    return {
      ...data,
      updateAt: Math.floor(Date.now() / 1000),
    };
  };

  return (
    <Edit transform={transform} actions={<CreateEditActions />}>
      <SimpleForm>
        <TextInput source="id" label="ID" disabled fullWidth />
        <TextInput source="address" label="用户地址" disabled fullWidth />
        <BooleanInput source="isRoot" label="是否根地址" fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;
