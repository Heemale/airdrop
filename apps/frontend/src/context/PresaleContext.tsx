'use client';

import React, { createContext, FC, ReactNode } from 'react';
import { NodeInfo } from '@local/airdrop-sdk/node';

export interface PresaleContextType {
  node: NodeInfo | null;
  setNode: React.Dispatch<React.SetStateAction<NodeInfo | null>>;
}

export const PresaleContext = createContext<PresaleContextType>({
  node: null,
  setNode: () => {},
});

const PresaleContextProvider: FC<{ children?: ReactNode | undefined }> = (
  props,
) => {
  const [node, setNode] = React.useState<NodeInfo | null>(null);

  return (
    <PresaleContext.Provider
      value={{
        node,
        setNode,
      }}
    >
      {props.children}
    </PresaleContext.Provider>
  );
};

export default PresaleContextProvider;
