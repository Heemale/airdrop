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
import DigestTextField from '@/components/helper/DigestTextField';
import AddressTextField from '@/components/helper/AddressTextField';
import { convertSmallToLarge } from '@/utils/math';
import { TOKEN_DECIMAL } from '@/config';
import * as React from 'react';

// 右上角 X 返回按钮
const ShowActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar>
      <Button
        label=""
        onClick={() => redirect('list', 'buy-records')}
        sx={{ minWidth: 0 }}
      >
        <CloseIcon />
      </Button>
    </TopToolbar>
  );
};

const BuyRecordShow = () => (
  <Show actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <DigestTextField source="txDigest" label="交易hash" />
      <TextField source="eventSeq" label="事件索引" />
      <TimeTextField source="timestamp" label="时间戳" />
      <AddressTextField source="sender" label="用户" />
      <TextField source="rank" label="节点等级" />
      <TextField source="nodeNum" label="节点序号" />
      <FunctionField
        source="paymentAmount"
        label="支付金额"
        render={(record) =>
          record.paymentAmount
            ? convertSmallToLarge(record.paymentAmount.toString(), TOKEN_DECIMAL)
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
            ? convertSmallToLarge(record.nodeReceiverGains.toString(), TOKEN_DECIMAL)
            : '-'
        }
      />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </SimpleShowLayout>
  </Show>
);

export default BuyRecordShow;