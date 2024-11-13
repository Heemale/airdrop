import * as React from 'react';
interface Props {
  translate: any;
}
const UpdateData = (props: Props) => {
  const { translate: t } = props;
  return (
    <div className="flex gap-2 mt-6">
      <div className="text-gradient sm:text-2xl font-semibold">
        <div>{t('Data update:')}</div>
      </div>
      <div className="text-white sm:text-2xl">
        <div>{t('September 10, 24:00 UTC')}</div>
      </div>
    </div>
  );
};

export default UpdateData;
