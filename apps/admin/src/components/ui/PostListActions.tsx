import {
  ExportButton,
  FilterButton,
  SelectColumnsButton,
  TopToolbar,
} from 'react-admin';
import * as React from 'react';

const PostListActions = () => (
  <TopToolbar>
    <SelectColumnsButton />
    <FilterButton />
    <ExportButton />
  </TopToolbar>
);

export default PostListActions;
