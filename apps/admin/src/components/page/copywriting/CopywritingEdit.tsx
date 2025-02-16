import { BooleanInput, Edit, SimpleForm, TextInput } from 'react-admin';
import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import CreateEditActions from '@/components/ui/CreateEditActions';

const CopywritingEdit = () => {
  const transform = async (data: any) => {
    return {
      ...data,
      updateAt: Math.floor(Date.now() / 1000), // Update the timestamp to current time
    };
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
          <TextInput source="imageUrl" label="图片链接" fullWidth />
          <BooleanInput source="isImage" label="是否为图片" fullWidth />
        </LocalizationProvider>
      </SimpleForm>
    </Edit>
  );
};

export default CopywritingEdit;
