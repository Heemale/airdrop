import { getAuth } from '@/config/auth';
import { BASE_URL } from '@/config';

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

  return response.text();
};
