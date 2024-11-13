import * as React from 'react';

interface Props {
  text: string;
  translate: any;
}

const RemainText = (props: Props) => {
  const { text } = props;
  const { translate: t } = props;
  return (
    <div className="bg-gradient-to-b from-[#222] to-[#010101] text-white text-sm sm:text-2xl border-black border rounded-2xl sm:px-12 py-2 sm:py-4 w-full text-center">
      <div>{t(text)}</div>
    </div>
  );
};

export default RemainText;
