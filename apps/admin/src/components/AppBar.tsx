import * as React from 'react';
import { AppBar as RaAppBar, TitlePortal } from 'react-admin';
import SuiConnectButton from '@/components/web3/sui/SuiConnectButton';

const AppBar = () => (
  <RaAppBar color="primary">
    <TitlePortal />
    <SuiConnectButton />
  </RaAppBar>
);

export default AppBar;
