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
import { convertSmallToLarge } from '@/utils/math';
import { TOKEN_DECIMAL } from '@/config';
import * as React from 'react';
import DigestTextField from '@/components/helper/DigestTextField';
import AddressTextField from '@/components/helper/AddressTextField';

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
  <TextInput key="receiver" name="receiver" source="receiver" label="接收人" />,
  <TextInput key="rank" name="rank" source="rank" label="节点等级" />,
  <TextInput key="nodeNum" name="nodeNum" source="nodeNum" label="节点序号" />,
  <TextInput
    key="paymentAmount"
    name="paymentAmount"
    source="paymentAmount"
    label="支付金额"
  />,
  <TextInput
    key="inviterGains"
    name="inviterGains"
    source="inviterGains"
    label="邀请人返利金额"
  />,
  <TextInput
    key="nodeReceiverGains"
    name="nodeReceiverGains"
    source="nodeReceiverGains"
    label="平台返利金额"
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

const TransferRecordList = () => (
  <List filters={postFilters} actions={<ListActions />}>
    <MyDatagridConfigurable isShow  sx={{
        '& .RaDatagrid-cell': {
          textAlign: 'left'
        }
      }} >
    <TextField source="id" label="ID" />
      <DigestTextField source="txDigest" label="交易hash" />
      <TextField source="eventSeq" label="事件索引" />
      <TimeTextField source="timestamp" label="时间戳" />
      <AddressTextField source="sender" label="用户" />
      <AddressTextField source="receiver" label="接收人" />
      <TextField source="rank" label="节点等级" />
      <TextField source="nodeNum" label="节点序号" />
      <FunctionField
        source="paymentAmount"
        label="支付金额"
        render={(record) =>
          record.paymentAmount
            ? convertSmallToLarge(
                record.paymentAmount.toString(),
                TOKEN_DECIMAL,
              )
            : '-'
        }
      />
      <FunctionField
        source="inviterGains"
        label="邀请收益"
        render={(record) =>
          record.inviterGains
            ? convertSmallToLarge(record.inviterGains.toString(), TOKEN_DECIMAL)
            : '-'
        }
      />
      <FunctionField
        source="nodeReceiverGains"
        label="平台收益"
        render={(record) =>
          record.nodeReceiverGains
            ? convertSmallToLarge(
                record.nodeReceiverGains.toString(),
                TOKEN_DECIMAL,
              )
            : '-'
        }
      />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </MyDatagridConfigurable>
  </List>
);

export default TransferRecordList;
