import * as React from 'react';
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  BooleanField,
  FunctionField,
  TopToolbar,
  Button,
  useRedirect,
} from 'react-admin';
import CloseIcon from '@mui/icons-material/Close';
import TimeTextField from '@/components/ui/TimeTextField';
import { convertSmallToLarge } from '@/utils/math';
import { TOKEN_DECIMAL } from '@/config';

// 自定义右上角 X 返回按钮
const ShowActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar>
      <Button
        label=""
        onClick={() => redirect('list', 'nodes')}
        sx={{ minWidth: 0 }}
      >
        <CloseIcon />
      </Button>
    </TopToolbar>
  );
};

const NodeShow = () => (
  <Show actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="rank" label="节点等级" />
      <TextField source="name" label="名称" />
      <TextField source="description" label="描述" />
      <BooleanField source="isOpen" label="是否开启" />
      <BooleanField source="isRemove" label="是否移除" />
      <NumberField source="limit" label="可领取次数" />
      <FunctionField
        source="price"
        label="节点价格"
        render={(record) =>
          convertSmallToLarge(record.price.toString(), TOKEN_DECIMAL)
        }
      />
      <NumberField source="totalQuantity" label="总数量" />
      <NumberField source="purchasedQuantity" label="已购买数量" />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </SimpleShowLayout>
  </Show>
);

export default NodeShow;