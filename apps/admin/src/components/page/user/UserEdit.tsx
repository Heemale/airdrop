import {
  BooleanInput,
  Edit,
  NumberInput,
  SimpleForm,
  TextInput,
} from 'react-admin';
import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PostCreateEditActions from '@/components/ui/PostCreateEditActions';
import MyDateTimePicker from '@/components/ui/MyDateTimePicker';

export const UserEdit = () => {
  const transform = async (data: any) => {
    return {
      ...data,
      updateAt: Math.floor(Date.now() / 1000),
    };
  };

  return (
    <Edit transform={transform} actions={<PostCreateEditActions />}>
      <SimpleForm>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <TextInput source="id" label="ID" disabled fullWidth />
          <TextInput source="txDigest" label="交易hash" fullWidth />
          <TextInput source="eventSeq" label="事件索引" fullWidth />
          <TextInput source="joinAt" label="加入时间" fullWidth />
          <TextInput source="address" label="用户地址" disabled fullWidth />
          <TextInput source="inviter" label="邀请人地址" disabled fullWidth />
          <TextInput source="inviterId" label="邀请人ID" disabled fullWidth />
          <TextInput
            source="sharerIds"
            label="直接推荐人列表"
            disabled
            fullWidth
          />
          <NumberInput
            source="totalInvestment"
            label="总投资金额"
            min={0}
            // render={record => convertSmallToLarge(record.totalInvestment.toString(), TOKEN_DECIMAL)}
            fullWidth
          />
          <MyDateTimePicker
            source="totalInvestmentUpdateAt"
            label="总投资金额更新时间"
          />
          <NumberInput
            source="totalGains"
            label="总收益金额"
            min={0}
            fullWidth
          />
          <MyDateTimePicker
            source="totalGainsUpdateAt"
            label="总收益金额更新时间"
          />
          <BooleanInput source="isBind" label="是否绑定" fullWidth />
        </LocalizationProvider>
      </SimpleForm>
    </Edit>
  );
};
