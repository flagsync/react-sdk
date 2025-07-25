import {
  FeatureFlags,
  FlagReturnType,
  IsFeatureFlagsEmpty,
  NoExplicitReturnType,
} from '@flagsync/js-sdk';
import { useMemo } from 'react';

import { useFlagSyncClient } from './use-flagsync-client';

export type UseFlag<TReturn, TKey extends string = string> = {
  key: IsFeatureFlagsEmpty<FeatureFlags> extends true
    ? TKey
    :
        | (TKey extends keyof FeatureFlags ? TKey : never)
        | (keyof FeatureFlags extends never ? never : keyof FeatureFlags);
  value: FlagReturnType<TReturn, TKey, FeatureFlags>;
  isReady: boolean;
  isReadyFromStore: boolean;
};

/**
 * A hook to retrieve a flag value from the FlagSync client
 * @param flagKey
 * @param defaultValue
 */
export function useFlag<
  TReturn = NoExplicitReturnType,
  TKey extends string = string,
>(
  flagKey: IsFeatureFlagsEmpty<FeatureFlags> extends true
    ? TKey
    :
        | (TKey extends keyof FeatureFlags ? TKey : never)
        | (keyof FeatureFlags extends never ? never : keyof FeatureFlags),

  defaultValue?: FlagReturnType<TReturn, TKey, FeatureFlags>,
) {
  const client = useFlagSyncClient();

  return useMemo<UseFlag<TReturn, TKey>>(() => {
    return {
      key: flagKey,
      value: client.flag(flagKey, defaultValue),
      isReady: client.isReady,
      isReadyFromStore: client.isReadyFromStore,
    };
  }, [client.lastUpdated, flagKey, defaultValue]);
}
