import * as React from 'react';
import {
  List,
  TextField,
  BooleanField,
  TextInput,
  FunctionField,
} from 'react-admin';
import MyDatagridConfigurable from '@/components/ui/MyDatagridConfigurable';
import TimeTextField from '@/components/ui/TimeTextField';
import MyImageField from '@/components/ui/MyImageField';

const postFilters = [
  <TextInput key="id" name="id" source="id" label="ID" />,
  <TextInput key="page" name="page" source="page" label="页面" />,
  <TextInput key="code" name="code" source="code" label="文案编码" />,
  <TextInput key="zh" name="zh" source="zh" label="中文" />,
  <TextInput key="en" name="en" source="en" label="英文" />,
  <TextInput key="vi" name="vi" source="vi" label="越南语" />,
  <TextInput
    key="imageUrl"
    name="imageUrl"
    source="imageUrl"
    label="图片链接"
  />,
  <TextInput
    key="isImage"
    name="isImage"
    source="isImage"
    label="是否为图片"
  />,
  <TextInput
    key="createAt"
    name="createAt"
    source="createAt"
    label="创建时间"
  />,
  <TextInput
    key="updateAt"
    name="updateAt"
    source="updateAt"
    label="更新时间"
  />,
];

const MediaConfigList = () => (
  <List filters={postFilters}>
    <MyDatagridConfigurable>
      <TextField source="id" label="ID" />
      <TextField source="page" label="页面" />
      <TextField source="code" label="文案编码" />
      <BooleanField source="isImage" label="是否为图片" />
      <FunctionField
        source="imageUrl"
        label="图片"
        render={(record) => (
          <MyImageField isImage={record.isImage} imageUrl={record.imageUrl} />
        )}
      />
      <TextField source="zh" label="中文" />
      <TextField source="en" label="英文" />
      <TextField source="vi" label="越南语" />
      <TextField source="imageUrl" label="图片链接" />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </MyDatagridConfigurable>
  </List>
);

export default MediaConfigList;
