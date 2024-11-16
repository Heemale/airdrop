import * as React from 'react';
import AirdropItem from '@/components/Event/AirdropItem';

interface Props {
  locale: string;
}

const data = [
  {
    id: 1,
  },
  {
    id: 2,
  },
];

const AirdropList = (props: Props) => {
  const { locale } = props;

  return (
    <div className="flex flex-col gap-6">
      {data &&
        data.map((item) => {
          return <AirdropItem key={item.id} data={item} locale={locale} />;
        })}
    </div>
  );
};

export default AirdropList;
