import * as React from 'react';
import RemainItem from '@/components/Home/RemainItem';

const Remain = () => {
  return (
    <div className="grid sm:grid-cols-2 gap-8">
      <RemainItem text="Quantity of units remaining for the current round" />
      <RemainItem text="Quantity sold during the current round" />
    </div>
  );
};

export default Remain;
