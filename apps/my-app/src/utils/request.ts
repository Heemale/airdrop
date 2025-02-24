import axios from 'axios';
import { BASE_URL } from '@/config';

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
});

instance.interceptors.response.use(
  (res) => {
    if (res.status === 200 || res.status === 201) {
      return res?.data;
    }
    return Promise.reject(res.data);
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
