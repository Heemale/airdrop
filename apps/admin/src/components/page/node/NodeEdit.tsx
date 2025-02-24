import {
  BooleanInput,
  Edit,
  NumberInput,
  SaveButton,
  SimpleForm,
  TextInput,
  Toolbar,
} from 'react-admin';
import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const PostEditToolbar = (props: any) => (
  <Toolbar {...props}>
    <SaveButton label="修改" />
  </Toolbar>
);

const transform = async (data: any) => {
  return {
    ...data,
    updateAt: Math.floor(Date.now() / 1000),
  };
};

const NodeEdit = () => {
  const onSubmit = (data: any) => {
    console.log({ data });
  };

  return (
    <Edit>
      <SimpleForm onSubmit={onSubmit} toolbar={<PostEditToolbar />}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextInput source="id" label="ID" disabled fullWidth />
          <TextInput source="name" label="名称" disabled fullWidth />
          <TextInput source="description" label="描述" multiline fullWidth />
          <NumberInput source="rank" label="节点等级" fullWidth />
          <BooleanInput source="isOpen" label="是否开启" fullWidth />
          <BooleanInput source="isRemove" label="是否移除" fullWidth />
          <NumberInput source="limit" label="可领取次数" fullWidth />
          <NumberInput source="price" label="节点价格" fullWidth />
          <NumberInput source="totalQuantity" label="总数量" fullWidth />
          <NumberInput
            source="purchasedQuantity"
            label="已购买数量"
            fullWidth
          />
        </LocalizationProvider>
      </SimpleForm>
    </Edit>
  );
};

export default NodeEdit;

const NodeInternal = () => {};
