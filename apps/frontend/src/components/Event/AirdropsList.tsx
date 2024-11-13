import * as React from 'react';
import AirdropsItem from '@/components/Event/AirdropsItem';
interface Props {
  translate: any;
}
const AirdropsList = (props: Props) => {
  const { translate: t } = props;
  const data = [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {data &&
        data.map((item) => {
          return <AirdropsItem key={item.id} data={item} translate={t} />;
        })}
    </div>
  );
};

export default AirdropsList;
