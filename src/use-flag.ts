import { useMemo } from 'react';

import { useFlagSyncClient } from '~sdk/use-flagsync-client';

export type UseFlagValue<T> = T | 'control';

export type UseFlag<T> = {
  value: UseFlagValue<T>;
  isReady: boolean;
  isReadyFromStore: boolean;
};

/**
 * A hook to retrieve a flag value from the FlagSync client
 * @param flagKey
 * @param defaultValue
 */
export function useFlag<T>(flagKey: string, defaultValue?: T): UseFlag<T> {
  const client = useFlagSyncClient();

  return useMemo<UseFlag<T>>(() => {
    return {
      value: client.flag(flagKey, defaultValue),
      isReady: client.isReady,
      isReadyFromStore: client.isReadyFromStore,
    };
  }, [client.lastUpdated, flagKey, defaultValue]);
}
