import {
  BooleanInput,
  Edit,
  ImageField,
  ImageInput,
  SimpleForm,
  TextInput,
  useNotify,
} from 'react-admin';
import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CreateEditActions from '@/components/ui/CreateEditActions';
import { BASE_URL } from '@/config';
import { getAuth } from '@/config/auth';

const MediaConfigEdit = () => {
  const notify = useNotify();

  const transform = async (data: any) => {
    // 没有上传图片
    if (!(typeof data.imageUrl === 'object')) {
      return {
        ...data,
        updateAt: Math.floor(Date.now() / 1000),
      };
    }

    try {
      const formData = new FormData();

      formData.append('file', data.imageUrl.rawFile);

      const token = getAuth();

      const request = new Request(`${BASE_URL}/api/upload/file`, {
        method: 'POST',
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
        body: formData,
      });

      const response = await fetch(request);

      const imageUrl = await response.text();

      return {
        imageUrl,
        updateAt: Math.floor(Date.now() / 1000),
      };
    } catch (e: any) {
      notify(`图片上传失败: ${e.message}`, { type: 'error' });
    }
  };

  return (
    <Edit transform={transform} actions={<CreateEditActions />}>
      <SimpleForm>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextInput source="id" label="ID" disabled fullWidth />
          <TextInput source="page" label="页面" disabled fullWidth />
          <TextInput source="code" label="文案编码" disabled fullWidth />
          <TextInput source="zh" label="中文" multiline fullWidth />
          <TextInput source="en" label="英文" multiline fullWidth />
          <TextInput source="vi" label="越南语" multiline fullWidth />
          <ImageInput source="imageUrl" label="图片">
            <ImageField source="src" title="title" />
          </ImageInput>
          <BooleanInput source="isImage" label="是否为图片" fullWidth />
        </LocalizationProvider>
      </SimpleForm>
    </Edit>
  );
};

export default MediaConfigEdit;
