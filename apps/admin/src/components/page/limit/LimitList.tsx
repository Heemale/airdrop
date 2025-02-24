import MyDatagridConfigurable from '@/components/ui/MyDatagridConfigurable';
import TimeTextField from '@/components/ui/TimeTextField';
import {
  BooleanField,
  FunctionField,
  List,
  TextField,
  TextInput,
} from 'react-admin';
import { convertSmallToLarge } from '@/utils/math';
import { TOKEN_DECIMAL } from '@/config';
import * as React from 'react';

const postFilters = [
  <TextInput key="id" name="id" source="id" label="ID" />,
  <TextInput key="address" name="address" source="address" label="用户地址" />,
  <TextInput key="times" name="times" source="times" label="次数" />,
  <TextInput key="isLimit" name="isLimit" source="isLimit" label="是否限制" />,
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

const LimitList = () => (
  <List filters={postFilters}>
    <MyDatagridConfigurable>
      <TextField source="id" label="ID" />
      <TextField source="address" label="用户地址" />
      <FunctionField
        source="times"
        label="次数"
        render={(record) =>
          convertSmallToLarge(record.times.toString(), TOKEN_DECIMAL)
        }
      />
      <BooleanField source="isLimit" label="是否限制" />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </MyDatagridConfigurable>
  </List>
);

export default LimitList;
