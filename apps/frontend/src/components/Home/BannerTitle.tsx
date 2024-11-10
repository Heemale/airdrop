import * as React from 'react';

interface Props {
  translate: any;
}

const BannerTitle = (props: Props) => {
  const { translate: t } = props;
  return (
    <div className="text-gradient flex flex-col gap-1 sm:gap-2 text-white text-3xl sm:text-7xl font-semibold">
      <div>{t('Unlock Exclusive')}</div>
      <div>{t('Rewards with')}</div>
      <div>{t('CoralPhone')}</div>
    </div>
  );
};

export default BannerTitle;
