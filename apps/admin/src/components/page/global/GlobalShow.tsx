import * as React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  TopToolbar,
  Button,
  useRedirect,
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import AddressTextField from '@/components/helper/AddressTextField';

// 右上角 X 返回按钮
const ShowActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar>
      <Button
        label=""
        onClick={() => redirect('list', 'objects')}
        sx={{ minWidth: 0 }}
      >
        <CloseIcon />
      </Button>
    </TopToolbar>
  );
};

const GlobalShow = () => (
  <Show actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <AddressTextField source="object" label="对象ID" />
      <BooleanField source="isValid" label="是否合法" />
    </SimpleShowLayout>
  </Show>
);

export default GlobalShow;