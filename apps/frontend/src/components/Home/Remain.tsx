import * as React from 'react';
import RemainItem from '@/components/Home/RemainItem';

interface Props {
  locale: string;
}

const Remain = async (props: Props) => {
  const { locale } = props;

  return (
    <div className="grid sm:grid-cols-2 gap-8">
      <RemainItem
        text="Quantity of units remaining for the current round"
        locale={locale}
      />
      <RemainItem
        text="Quantity sold during the current round"
        locale={locale}
      />
    </div>
  );
};

export default Remain;
