import React, { useEffect, createContext, useContext, ReactNode, useRef, useState } from 'react';
import type { FsConfig } from '@flagsync/js-sdk';

import { getFlagSyncClient } from "./utils";
import { DecoratedFsClient } from "./types";
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
  const clientRef = useRef<ReturnType<typeof getFlagSyncClient> | null>(null);
  const [_, setMounted] = useState(false);

  if (clientRef.current === null) {
    clientRef.current = getFlagSyncClient(config);
  }

  useEffect(() => {
    if (clientRef.current === null) {
      clientRef.current = getFlagSyncClient(config);
      setMounted((prev) => !prev);
    }

    return () => {
      clientRef.current?.kill();
      clientRef.current = null;
    };
  }, []);

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
