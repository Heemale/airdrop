'use client';

import React, { createContext, FC, ReactNode, useState } from 'react';
import { normalizeSuiAddress } from '@mysten/sui/utils';

export interface InviteDialogContextType {
  inviter: string;
  open: boolean;
  hasInviter: boolean;
  setInviter: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHasInviter: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InviteDialogContext = createContext<InviteDialogContextType>({
  inviter: '',
  open: false,
  hasInviter: false,
  setInviter: () => {},
  setOpen: () => {},
  setHasInviter: () => {},
});

const InviteDialogContextProvider: FC<{ children?: ReactNode | undefined }> = (
  props,
) => {
  const [inviter, setInviter] = useState<string>(normalizeSuiAddress('0x0'));
  const [open, setOpen] = useState<boolean>(false);
  const [hasInviter, setHasInviter] = useState<boolean>(false);

  return (
    <InviteDialogContext.Provider
      value={{
        inviter,
        open,
        hasInviter,
        setInviter,
        setOpen,
        setHasInviter,
      }}
    >
      {props.children}
    </InviteDialogContext.Provider>
  );
};

export default InviteDialogContextProvider;
