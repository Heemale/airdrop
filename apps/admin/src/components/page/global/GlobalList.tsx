import MyDatagridConfigurable from '@/components/ui/MyDatagridConfigurable';
import {
  BooleanField,
  CreateButton,
  ExportButton,
  FilterButton,
  List,
  sanitizeListRestProps,
  SelectColumnsButton,
  TextField,
  TextInput,
  TopToolbar,
  useListContext,
} from 'react-admin';
import * as React from 'react';

const postFilters = [
  <TextInput key="id" name="id" source="id" label="ID" />,
  <TextInput key="object" name="object" source="object" label="对象ID" />,
  <TextInput key="isValid" name="isValid" source="isValid" label="是否合法" />,
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

const GlobalList = () => (
  <List filters={postFilters} actions={<ListActions />}>
    <MyDatagridConfigurable>
      <TextField source="id" label="ID" />
      <TextField source="object" label="对象ID" />
      <BooleanField source="isValid" label="是否合法" />
    </MyDatagridConfigurable>
  </List>
);

export default GlobalList;
