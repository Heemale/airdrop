import {
  BooleanInput,
  Edit,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar as RaToolbar,
} from 'react-admin';
import React from 'react';
import CreateEditActions from '@/components/ui/CreateEditActions';

const Toolbar = (props: any) => (
  <RaToolbar {...props}>
    <SaveButton label="修改" />
  </RaToolbar>
);

const UserEdit = () => {
  const transform = async (data: any) => {
    return {
      ...data,
      updateAt: Math.floor(Date.now() / 1000),
    };
  };

  return (
    <Edit transform={transform} actions={<CreateEditActions />}>
      <SimpleForm toolbar={<Toolbar />}>
        <TextInput source="id" label="ID" disabled fullWidth />
        <TextInput source="address" label="用户地址" disabled fullWidth />
        <BooleanInput source="isRoot" label="是否根地址" fullWidth />
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;
