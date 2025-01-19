'use client';

import { ConnectButton as Connect } from '@mysten/dapp-kit';
import { useClientTranslation } from '@/hook';

interface Props {
  connectText: string;
}

const ConnectButton = (props: Props) => {
  const { connectText } = props;
  const { t } = useClientTranslation();

  return <Connect connectText={t(connectText)} />;
};

export default ConnectButton;
