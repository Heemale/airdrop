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
import MyImageField from '@/components/ui/MyImageField';

// 右上角 X 返回按钮
const ShowActions = () => {
  const redirect = useRedirect();
  return (
    <TopToolbar>
      <Button
        label=""
        onClick={() => redirect('list', 'media-configs')}
        sx={{ minWidth: 0 }}
      >
        <CloseIcon />
      </Button>
    </TopToolbar>
  );
};

const MediaConfigShow = () => (
  <Show actions={<ShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="page" label="页面" />
      <TextField source="code" label="文案编码" />
      <BooleanField source="isImage" label="是否为图片" />
      <FunctionField
        source="imageUrl"
        label="图片"
        render={(record) => (
          <MyImageField isImage={record.isImage} imageUrl={record.imageUrl} />
        )}
      />
      <TextField source="zh" label="中文" />
      <TextField source="en" label="英文" />
      <TextField source="vi" label="越南语" />
      <TextField source="imageUrl" label="图片链接" />
      <TimeTextField source="createAt" label="创建时间" />
      <TimeTextField source="updateAt" label="更新时间" />
    </SimpleShowLayout>
  </Show>
);

export default MediaConfigShow;