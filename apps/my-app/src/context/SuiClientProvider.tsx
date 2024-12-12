"use client";
import {
  createNetworkConfig,
  SuiClientProvider as ClientProvider,
} from "@mysten/dapp-kit";
import React from "react";
import { RPC } from "@/config";

const SuiClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { networkConfig } = createNetworkConfig({
    mainnet: { url: RPC },
  });

  // @ts-ignore
  return (
    <ClientProvider networks={networkConfig} defaultNetwork="mainnet">
      {children}
    </ClientProvider>
  );
};

export default SuiClientProvider;
