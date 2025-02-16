import {
  ExportButton,
  FilterButton,
  SelectColumnsButton,
  TopToolbar,
} from 'react-admin';
import * as React from 'react';

const ListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

export default ListActions;
