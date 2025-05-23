'use client';
import * as React from 'react';
import RemainText from '@/components/Home/RemainText';
import NumberPlate2 from '@/components/Home/NumberPlate2';
import { useClientTranslation } from '@/hook';

interface Props {
  text: string;
}

const RemainItem = (props: Props) => {
  const { text } = props;
  const { t } = useClientTranslation();

  return (
    <div className="sm:col-span-1 flex flex-col items-center gap-10 w-full">
      <RemainText text={text} translate={t} />
      <div className="flex gap-3 sm:gap-8 text-7xl sm:text-9xl font-bold italic">
        <NumberPlate2 num="-" />
        <NumberPlate2 num="-" />
      </div>
    </div>
  );
};

export default RemainItem;
