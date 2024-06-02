import { FsFlagSet } from '@flagsync/js-sdk';
import { useMemo } from 'react';

import { useFlagSyncClient } from '~sdk/use-flagsync-client';

export type UseFlags = {
  flags: FsFlagSet;
  isReady: boolean;
  isReadyFromStore: boolean;
};

/**
 * Hook to get multiple flags with the given default values.
 * @param defaultValues
 */
export function useFlags(defaultValues: FsFlagSet = {}): UseFlags {
  const client = useFlagSyncClient();

  return useMemo<UseFlags>(() => {
    return {
      flags: client.flags(defaultValues),
      isReady: client.isReady,
      isReadyFromStore: client.isReadyFromStore,
    };
  }, [client.lastUpdated]);
}
