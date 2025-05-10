import MyDatagridConfigurable from '@/components/ui/MyDatagridConfigurable';
import TimeTextField from '@/components/ui/TimeTextField';
import {
  BooleanField,
  EditButton,
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
  <TextInput key="joinAt" name="joinAt" source="joinAt" label="加入时间" />,
  <TextInput key="address" name="address" source="address" label="用户地址" />,
  <TextInput
    key="inviterId"
    name="inviterId"
    source="inviterId"
    label="邀请人ID"
  />,
  <TextInput
    key="inviter"
    name="inviter"
    source="inviter"
    label="邀请人地址"
  />,
  <TextInput
    key="sharerIds"
    name="sharerIds"
    source="sharerIds"
    label="直接推荐人列表"
  />,
  <TextInput
    key="totalInvestment"
    name="totalInvestment"
    source="totalInvestment"
    label="总投资金额"
  />,
  <TextInput
    key="totalInvestmentUpdateAt"
    name="totalInvestmentUpdateAt"
    source="totalInvestmentUpdateAt"
    label="总投资金额更新时间"
  />,
  <TextInput
    key="totalGains"
    name="totalGains"
    source="totalGains"
    label="总收益金额"
  />,
  <TextInput
    key="totalGainsUpdateAt"
    name="totalGainsUpdateAt"
    source="totalGainsUpdateAt"
    label="总收益金额更新时间"
  />,
  <TextInput key="isBind" name="isBind" source="isBind" label="是否绑定" />,
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

const UserList = () => (
  <List filters={postFilters} actions={<ListActions />}>
    <MyDatagridConfigurable>
      <TextField source="id" label="ID" />
      <TextField source="inviterId" label="邀请人ID" />
      <TextField source="address" label="用户地址" />
      <TextField source="inviter" label="邀请人地址" />
      <TextField source="sharerIds" label="直接推荐人列表" />
      <FunctionField
        source="totalInvestment"
        label="总投资金额"
        render={(record) =>
          record
            ? convertSmallToLarge(
                record.totalInvestment.toString(),
                TOKEN_DECIMAL,
              )
            : '-'
        }
      />
      <FunctionField
        source="totalGains"
        label="总收益金额"
        render={(record) =>
          convertSmallToLarge(record.totalGains.toString(), TOKEN_DECIMAL)
        }
      />
      <TimeTextField
        source="totalInvestmentUpdateAt"
        label="总投资金额更新时间"
      />
      <TimeTextField source="totalGainsUpdateAt" label="总收益金额更新时间" />
      <BooleanField source="isBind" label="是否绑定" />
      <BooleanField source="isRoot" label="是否根地址" />
      <TextField source="txDigest" label="交易hash" />
      <TextField source="eventSeq" label="事件索引" />
      <TimeTextField source="joinAt" label="加入时间" />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
      <EditButton label="编辑" />
    </MyDatagridConfigurable>
  </List>
);

export default UserList;
