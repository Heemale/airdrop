import { BASE_URL } from '@/config/index';
import { dataProvider as provider } from 'ra-data-simple-prisma';
import { getAuth } from '@/config/auth';

export const dataProvider = provider(`${BASE_URL}/api`, {
  axiosInterceptors: {
    request: [
      {
        options: {
          runWhen: (config) => {
            const auth = getAuth();
            config.headers.authorization = `Bearer ${auth}`;
            return config as unknown as boolean;
          },
        },
      },
    ],
  },
});
