'use client';

import { ConnectButton as Connect } from '@mysten/dapp-kit';

interface Props {
  connectText: string;
}

const ConnectButton = (props: Props) => {
  const { connectText } = props;

  return <Connect connectText={connectText} />;
};

export default ConnectButton;
