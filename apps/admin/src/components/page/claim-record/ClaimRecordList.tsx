import MyDatagridConfigurable from '@/components/ui/MyDatagridConfigurable';
import TimeTextField from '@/components/ui/TimeTextField';
import { FunctionField, List, TextField, TextInput } from 'react-admin';
import { convertSmallToLarge } from '@/utils/math';
import { TOKEN_DECIMAL } from '@/config';
import * as React from 'react';

const postFilters = [
  <TextInput key="id" name="id" source="id" label="ID" />,
  <TextInput
    key="txDigest"
    name="txDigest"
    source="txDigest"
    label="交易hash"
  />,
  <TextInput
    key="eventSeq"
    name="eventSeq"
    source="eventSeq"
    label="事件索引"
  />,
  <TextInput
    key="timestamp"
    name="timestamp"
    source="timestamp"
    label="时间戳"
  />,
  <TextInput key="sender" name="sender" source="sender" label="用户" />,
  <TextInput key="round" name="round" source="round" label="回合" />,
  <TextInput key="coinType" name="coinType" source="coinType" label="币种" />,
  <TextInput key="amount" name="amount" source="amount" label="数量" />,
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

const ClaimRecordList = () => (
  <List filters={postFilters}>
    <MyDatagridConfigurable>
      <TextField source="id" label="ID" />
      <TextField source="txDigest" label="交易hash" />
      <TextField source="eventSeq" label="事件索引" />
      <TimeTextField source="timestamp" label="时间戳" />
      <TextField source="sender" label="用户" />
      <TextField source="round" label="回合" />
      <TextField source="coinType" label="币种" />
      <FunctionField
        source="amount"
        label="数量"
        render={(record) =>
          convertSmallToLarge(record.amount.toString(), TOKEN_DECIMAL)
        }
      />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </MyDatagridConfigurable>
  </List>
);

export default ClaimRecordList;
