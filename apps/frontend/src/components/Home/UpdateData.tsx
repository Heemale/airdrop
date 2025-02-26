'use client';

import * as React from 'react';
import { useClientTranslation } from '@/hook';


const UpdateData =  () => {
  const { t } = useClientTranslation();

  return (
    <div className="flex gap-2 mt-6">
      <div className="text-gradient sm:text-2xl font-semibold">
        <div>{t('Data update:')}</div>
      </div>
      <div className="text-white sm:text-2xl">
        <div>{t('September 10, 24:00 UTC')}</div>
      </div>
    </div>
  );
};

export default UpdateData;
