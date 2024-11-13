import * as React from 'react';
interface Props {
  translate: any;
}
const BuyNodeTitle = (props: Props) => {
  const { translate: t } = props;
  return (
    <div className="flex flex-col gap-8 sm:mt-10 mx-10">
      <div className="font-orbitron text-white text-2xl sm:text-5xl font-semibold">
        <div>{t(' Buy Nodes')}</div>
      </div>
      <div className="font-orbitron text-gray-400 font-semibold">
        Public sale starts on September 21, 09:00 PM
      </div>
    </div>
  );
};

export default BuyNodeTitle;
