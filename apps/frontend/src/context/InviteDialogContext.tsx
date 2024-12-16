'use client';

import React, { createContext, FC, ReactNode, useState } from 'react';
import { normalizeSuiAddress } from '@mysten/sui/utils';

export interface InviteDialogContextType {
  inviter: string | null;
  open: boolean;
  hasInviter: boolean;
  setInviter: React.Dispatch<React.SetStateAction<string | null>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHasInviter: React.Dispatch<React.SetStateAction<boolean>>;
}

export const InviteDialogContext = createContext<InviteDialogContextType>({
  inviter: null,
  open: false,
  hasInviter: false,
  setInviter: () => {},
  setOpen: () => {},
  setHasInviter: () => {},
});

const InviteDialogContextProvider: FC<{ children?: ReactNode | undefined }> = (
  props,
) => {
  const [inviter, setInviter] = useState<string | null>(null);
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
