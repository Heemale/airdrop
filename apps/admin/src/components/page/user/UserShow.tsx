import * as React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  FunctionField,
  TopToolbar,
  Button,
  useRedirect,
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import TimeTextField from '@/components/ui/TimeTextField';
import AddressTextField from '@/components/helper/AddressTextField';
import DigestTextField from '@/components/helper/DigestTextField';
import { convertSmallToLarge } from '@/utils/math';
import { TOKEN_DECIMAL } from '@/config';

// 右上角 X 返回按钮
const ShowActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar>
      <Button
        label=""
        onClick={() => redirect('list', 'users')}
        sx={{ minWidth: 0 }}
      >
        <CloseIcon />
      </Button>
    </TopToolbar>
  );
};

const UserShow = () => (
  <Show actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="inviterId" label="邀请人ID" />
      <AddressTextField source="address" label="用户地址" />
      <AddressTextField source="inviter" label="邀请人地址" />
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
      <DigestTextField source="txDigest" label="交易hash" />
      <TextField source="eventSeq" label="事件索引" />
      <TimeTextField source="joinAt" label="加入时间" />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </SimpleShowLayout>
  </Show>
);

export default UserShow;