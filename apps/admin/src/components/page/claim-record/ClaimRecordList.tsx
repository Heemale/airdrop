import MyDatagridConfigurable from '@/components/ui/MyDatagridConfigurable';
import TimeTextField from '@/components/ui/TimeTextField';
import {
  ExportButton,
  FilterButton,
  FunctionField,
  List,
  sanitizeListRestProps,
  SelectColumnsButton,
  TextField,
  TextInput,
  TopToolbar,
  useListContext,
} from 'react-admin';
import * as React from 'react';
import UnitConvertField from '@/components/helper/UnitConvertField';
import { formatType } from '@/helper';
import AddressTextField from '@/components/helper/AddressTextField';
import DigestTextField from '@/components/helper/DigestTextField';

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
  <TextInput
    key="coinType"
    name="coinType"
    source="coinType"
    label="货币类型"
  />,
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

const ListActions = (props: any) => {
  const { className, exporter, filters, maxResults, ...rest } = props;
  const { total } = useListContext();

  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      <FilterButton />
      <SelectColumnsButton />
      <ExportButton
        exporter={exporter}
        maxResults={maxResults}
        disabled={total === 0}
      />
    </TopToolbar>
  );
};

const ClaimRecordList = () => (
  <List filters={postFilters} actions={<ListActions />}>
    <MyDatagridConfigurable isShow>
    <TextField source="id" label="ID" />
      <DigestTextField source="txDigest" label="交易hash" />
      <TextField source="eventSeq" label="事件索引" />
      <TimeTextField source="timestamp" label="时间戳" />
      <AddressTextField source="sender" label="用户" />
      <TextField source="round" label="回合" />
      <FunctionField
        source="coinType"
        label="货币类型"
        render={(record) => formatType(record.coinType) ?? '-'}
      />
      <UnitConvertField source="amount" label="数量" />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </MyDatagridConfigurable>
  </List>
);

export default ClaimRecordList;
