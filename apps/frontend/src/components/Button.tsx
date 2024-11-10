import * as React from 'react';

interface Props {
  text: string;
  className?: string;
}

const Button: React.FC<Props> = ({ text, className }) => {
  return (
    <div
      className={`${className} relative inline-block bg-[url('/button_bg.png')] bg-cover text-black font-bold text-center py-3 px-6 rounded-lg shadow-lg transition-transform transform active:scale-95 cursor-pointer`}
    >
      {text}
    </div>
  );
};

export default Button;
