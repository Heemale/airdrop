import React from 'react';
import {
  PasswordInput,
  SimpleForm,
  TextInput,
  useLogout,
  useNotify,
} from 'react-admin';
import { changePassword } from '@/api';

const ChangePassword = () => {
  const notify = useNotify();
  const logout = useLogout();

  const onSubmit = async (data: any) => {
    if (!data?.newPassword) {
      notify(`请填写密码`, { type: 'error' });
      return;
    }

    try {
      await changePassword(data);
      notify(`修改成功`, { type: 'success' });
      await logout();
    } catch (e: any) {
      notify(`修改失败: ${e}`, { type: 'error' });
    }
  };

  return (
    <SimpleForm onSubmit={onSubmit}>
      <TextInput
        source="username"
        label="用户名"
        autoComplete="username"
        style={{ display: 'none' }}
      />
      <PasswordInput
        source="newPassword"
        label="新密码"
        autoComplete="new-password"
      />
    </SimpleForm>
  );
};

export default ChangePassword;
