import MyDatagridConfigurable from '@/components/ui/MyDatagridConfigurable';
import TimeTextField from '@/components/ui/TimeTextField';
import {
  BooleanField,
  NumberField,
  List,
  TextField,
  TextInput,
  useListContext,
  TopToolbar,
  sanitizeListRestProps,
  CreateButton,
  FilterButton,
  SelectColumnsButton,
  ExportButton,
} from 'react-admin';
import * as React from 'react';
import AddressTextField from '@/components/helper/AddressTextField';

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

const ListActions = (props: any) => {
  const { className, exporter, filters, maxResults, ...rest } = props;
  const { total } = useListContext();

  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      <CreateButton />
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

const LimitList = () => (
  <List filters={postFilters} actions={<ListActions />}>
    <MyDatagridConfigurable hasEdit isShow sx={{
        '& .RaDatagrid-cell': {
          textAlign: 'left'
        }
      }}>
      <TextField source="id" label="ID" />
      <AddressTextField source="address" label="用户地址" />
      <NumberField source="times" label="次数" />
      <BooleanField source="isLimit" label="是否限制" />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </MyDatagridConfigurable>
  </List>
);

export default LimitList;
