import React, { useEffect, createContext, useContext, ReactNode, useRef, useState } from 'react';
import type { FsConfig } from '@flagsync/js-sdk';

import { getFlagSyncClient } from "~sdk/utils";
import { DecoratedFsClient } from "~sdk/types";
import { ProviderChildren } from './provider-children';

export interface FlagProviderContextValue {
  client: DecoratedFsClient;
}

const FlagSyncContext = createContext<FlagProviderContextValue | null>(null);

export const FlagSyncProvider = ({
  children,
  config,
  waitForReady = false,
}: {
  children: ReactNode;
  config: FsConfig;
  waitForReady?: boolean;
}) => {
  const configRef = useRef<FsConfig | null>(null);
  const clientRef = useRef<ReturnType<typeof getFlagSyncClient> | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const configChanged =
      JSON.stringify(configRef.current) !== JSON.stringify(config);

    if (!clientRef.current || configChanged) {
      if (clientRef.current) {
        clientRef.current.kill();
      }

      clientRef.current = getFlagSyncClient(config);
      configRef.current = config;
      forceUpdate((n) => n + 1);
    }

    return () => {
      clientRef.current?.kill();
      clientRef.current = null;
    };
  }, [config]);

  if (!clientRef.current) {
    clientRef.current = getFlagSyncClient(config);
    configRef.current = config;
  }

  return (
    <FlagSyncContext.Provider value={{ client: clientRef.current }}>
       <ProviderChildren waitForReady={waitForReady}>
        {children}
      </ProviderChildren>
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
