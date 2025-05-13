import * as React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  FunctionField,
  TopToolbar,
  Button,
  useRedirect,
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import TimeTextField from '@/components/ui/TimeTextField';
import UnitConvertField from '@/components/helper/UnitConvertField';
import { formatType } from '@/helper';
import AddressTextField from '@/components/helper/AddressTextField';
import DigestTextField from '@/components/helper/DigestTextField';

// 右上角 X 返回按钮
const ShowActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar>
      <Button
        label=""
        onClick={() => redirect('list', 'claim-records')}
        sx={{ minWidth: 0 }}
      >
        <CloseIcon />
      </Button>
    </TopToolbar>
  );
};

const ClaimRecordShow = () => (
  <Show actions={<ShowActions />}>
    <SimpleShowLayout>
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
    </SimpleShowLayout>
  </Show>
);

export default ClaimRecordShow;