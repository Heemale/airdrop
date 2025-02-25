import MyDatagridConfigurable from './MyDatagridConfigurable';
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
  <TextInput key="round" name="round" source="round" label="轮次" />,
  <TextInput
    key="startTime"
    name="startTime"
    source="startTime"
    label="开始时间"
  />,
  <TextInput key="endTime" name="endTime" source="endTime" label="结束时间" />,
  <TextInput
    key="totalShares"
    name="totalShares"
    source="totalShares"
    label="总份数"
  />,
  <TextInput
    key="claimedShares"
    name="claimedShares"
    source="claimedShares"
    label="已领取份数"
  />,
  <TextInput
    key="totalBalance"
    name="totalBalance"
    source="totalBalance"
    label="总资金"
  />,
  <TextInput key="isOpen" name="isOpen" source="isOpen" label="是否开放" />,
  <TextInput
    key="coinType"
    name="coinType"
    source="coinType"
    label="货币类型"
  />,
  <TextInput
    key="imageUrl"
    name="imageUrl"
    source="imageUrl"
    label="空投图片"
  />,
  <TextInput
    key="remainingBalance"
    name="remainingBalance"
    source="remainingBalance"
    label="空投剩余资金"
  />,
  <TextInput
    key="isRemove"
    name="isRemove"
    source="isRemove"
    label="是否移除"
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
  <TextInput
    key="description"
    name="description"
    source="description"
    label="描述"
  />,
];

const AirdropList = () => (
  <List filters={postFilters}>
    <MyDatagridConfigurable hasEdit>
      <TextField source="id" label="ID" />
      <TextField source="round" label="轮次" />
      <TimeTextField source="startTime" label="开始时间" />
      <TimeTextField source="endTime" label="结束时间" />
      <TextField source="totalShares" label="总份数" />
      <TextField source="claimedShares" label="已领取份数" />
      <TextField source="description" label="描述" />
      <FunctionField
        source="totalBalance"
        label="总资金"
        render={(record) =>
          record.totalBalance
            ? convertSmallToLarge(record.totalBalance.toString(), TOKEN_DECIMAL)
            : '-'
        }
      />
      <BooleanField source="isOpen" label="是否开放" />
      <TextField source="coinType" label="货币类型" />
      <TextField source="imageUrl" label="空投图片" />
      <FunctionField
        source="remainingBalance"
        label="空投剩余资金"
        render={(record) =>
          record.remainingBalance
            ? convertSmallToLarge(
                record.remainingBalance.toString(),
                TOKEN_DECIMAL,
              )
            : '-'
        }
      />
      <BooleanField source="isRemove" label="是否移除" />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </MyDatagridConfigurable>
  </List>
);

export default AirdropList;
