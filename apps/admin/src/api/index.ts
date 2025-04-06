import { getAuth } from '@/config/auth';
import { BASE_URL } from '@/config';
import {
  ChangePasswordDto,
  GetTeamInfoDto,
  GetUserByAddressDto,
  Tree,
} from '@/api/types';

export const uploadImage = async (rawFile: string | Blob): Promise<string> => {
  const token = getAuth();
  if (!token) return Promise.reject();

  const formData = new FormData();
  formData.append('file', rawFile);

  const request = new Request(`${BASE_URL}/api/upload/file`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
    body: formData,
  });

  const response = await fetch(request);

  if (response.status !== 201) {
    throw new Error(response.statusText);
  }

  return response.text();
};

export const changePassword = async (params: ChangePasswordDto) => {
  const token = getAuth();
  if (!token) return Promise.reject();

  const request = new Request(`${BASE_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  });

  const response = await fetch(request);

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  return response.text();
};

export const getTree = async (
  params?: GetTeamInfoDto,
): Promise<Array<Tree>> => {
  const request = new Request(`${BASE_URL}/api/users/tree`, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(params),
  });

  const response = await fetch(request);

  if (response.status !== 201) {
    throw new Error(response.statusText);
  }

  return response.json();
};

export const getUserByAddress = async (
  params: GetUserByAddressDto,
): Promise<Tree | null> => {
  const request = new Request(
    `${BASE_URL}/api/users/address/${params.address}`,
    {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    },
  );

  const response = await fetch(request);

  if (response.status !== 200) {
    throw new Error(response.statusText);
  }

  const user = await response.json();
  if (!user || user.id === 0) return null;

  return user;
};
