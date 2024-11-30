'use client';

import * as React from 'react';

interface Props {
  text: string;
  className?: string;
  onClick?: any;
}

const Button = (props: Props) => {
  const { text, className, onClick } = props;

  return (
    <button
      className={`${className && className} relative inline-block bg-gradient-to-r from-[#40cafd] to-[#1993ee] text-black font-bold text-center text-lg py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
