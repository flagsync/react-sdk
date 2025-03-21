import { ReactNode } from 'react';

import { useFlagSyncClient } from './use-flagsync-client';

interface ProviderChildrenProps {
  children: ReactNode;
  waitForReady: boolean;
}

export const ProviderChildren = ({
  children,
  waitForReady,
}: ProviderChildrenProps) => {
  const client = useFlagSyncClient();
  return waitForReady && !client.isReady ? null : children;
};
