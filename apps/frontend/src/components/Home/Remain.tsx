import * as React from 'react';
import RemainItem from '@/components/Home/RemainItem';

interface remainItemType {
  id: string;
  text: string;
}

const remainItems: Array<remainItemType> = [
  {
    id: '1',
    text: 'Quantity of units remaining for the current round',
  },
  {
    id: '2',
    text: 'Quantity sold during the current round',
  },
];

const Remain = async () => {
  return (
    <div className="grid sm:grid-cols-2 gap-8">
      {remainItems &&
        remainItems.map((item) => {
          return <RemainItem key={item.id} text={item.text} />;
        })}
    </div>
  );
};

export default Remain;
