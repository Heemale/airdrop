import * as React from 'react';
import RemainItem from '@/components/Home/RemainItem';
interface Props {
  translate: any;
}
const Remain = (props: Props) => {
  const { translate: t } = props;
  return (
    <div className="grid sm:grid-cols-2 gap-8">
      <RemainItem
        text="Quantity of units remaining for the current round"
        translate={t}
      />
      <RemainItem text="Quantity sold during the current round" translate={t} />
    </div>
  );
};

export default Remain;
