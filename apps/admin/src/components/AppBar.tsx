import * as React from 'react';
import { AppBar as RaAppBar, TitlePortal } from 'react-admin';

const AppBar = () => (
  <RaAppBar color="primary">
    <TitlePortal />
  </RaAppBar>
);

export default AppBar;
