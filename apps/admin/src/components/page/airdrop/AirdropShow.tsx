import {
  Show,
  SimpleShowLayout,
  TextField,
  FunctionField,
  BooleanField,
  TopToolbar,
  Button,
  useRedirect,
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import TimeTextField from '@/components/ui/TimeTextField';
import UnitConvertField from '@/components/helper/UnitConvertField';
import { formatType } from '@/helper';

// 右上角 X 返回按钮
const ShowActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar>
      <Button
        label=""
        onClick={() => redirect('list', 'airdrops')}
        sx={{ minWidth: 0 }}
      >
        <CloseIcon />
      </Button>
    </TopToolbar>
  );
};

const AirdropShow = () => (
  <Show actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="round" label="轮次" />
      <TimeTextField source="startTime" label="开始时间" />
      <TimeTextField source="endTime" label="结束时间" />
      <TextField source="totalShares" label="总份数" />
      <TextField source="claimedShares" label="已领取份数" />
      <TextField source="description" label="描述" />
      <UnitConvertField source="totalBalance" label="总资金" />
      <BooleanField source="isOpen" label="是否开放" />
      <FunctionField
        source="coinType"
        label="货币类型"
        render={(record) => formatType(record.coinType) ?? '-'}
      />
      <TextField source="imageUrl" label="空投图片" />
      <UnitConvertField source="remainingBalance" label="空投剩余资金" />
      <BooleanField source="isRemove" label="是否移除" />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </SimpleShowLayout>
  </Show>
);

export default AirdropShow;