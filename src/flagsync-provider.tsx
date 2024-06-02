import React, { useEffect, createContext, useContext, ReactNode } from 'react';
import { FlagSyncConfig } from '@flagsync/js-sdk';

import { getFlagSyncClient } from "~sdk/utils";
import { DecoratedFsClient } from "~sdk/types";

export interface FlagProviderContextValue {
  client: DecoratedFsClient;
}

const FlagSyncContext = createContext<FlagProviderContextValue | null>(null);

export const FlagSyncProvider = ({
  children,
  config,
}: {
  children: ReactNode;
  config: FlagSyncConfig;
}) => {
  const client = getFlagSyncClient(config);

  useEffect(() => {
    return () => {
      client.kill();
    };
  }, []);

  return (
    <FlagSyncContext.Provider value={{ client }}>
      {children}
    </FlagSyncContext.Provider>
  );
};

export const useFlagSyncProviderContext = () => {
  const context = useContext(FlagSyncContext);
  if (!context) {
    throw new Error(
      'useFlagProviderContext must be used within a FlagSyncProvider',
    );
  }
  return context;
};
