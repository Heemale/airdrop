'use client';

import * as React from 'react';
import { useClientTranslation } from '@/hook';

interface Props {
  text: string;
  className?: string;
  onClick?: any;
}

const Button = (props: Props) => {
  const { text, className, onClick } = props;
  const { t } = useClientTranslation();

  return (
    <button
      className={`${className && className} relative inline-block bg-gradient-to-r from-[#40cafd] to-[#1993ee] text-black font-bold text-center text-lg py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer`}
      onClick={onClick}
    >
      {t(text)} {/* 使用t函数来翻译文本 */}
    </button>
  );
};

export default Button;
