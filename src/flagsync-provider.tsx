import React, { useEffect, createContext, useContext, ReactNode, useRef, useState } from 'react';
import { FsConfig } from '@flagsync/js-sdk';

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
  config: FsConfig;
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
