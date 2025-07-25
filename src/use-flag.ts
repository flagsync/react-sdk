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
 * Evaluates a feature flag for a given user context with full type-safety.
 *
 * This function is designed to work with or without `FlagSync CLI` generated
 * TypeScript types, providing robust type inference, validation, and autocompletion.
 *
 * @example With FlagSync CLI generated types (recommended for full type-safety and DX):
 * ```ts
 * declare module '@flagsync/react-sdk' {
 *   interface FeatureFlags {
 *     'price-discount': 0.1 | 0.2;
 *     'layout': 'v1' | 'v2' | 'v3';
 *     'killswitch': boolean;
 *   }
 * }
 *
 * const discount = useFlag('price-discount');         // Type: 0.1 | 0.2
 * const layout = useFlag('layout', 'v1');             // Type: 'v1' | 'v2' | 'v3' (defaultValue must be 'v1' | 'v2' | 'v3')
 * const isEnabled = useFlag('killswitch');            // Type: boolean
 * const value = useFlag('not-a-real-flag');           // ❌ TS Error: Argument is not a key of FeatureFlags
 * const badDefault = useFlag('price-discount', 0.5);  // ❌ TS Error: Default value type mismatch
 * ```
 *
 * When not using FlagSync CLI, you must manually type the flag value, or
 * it will be inferred as "unknown"
 *
 * @example Without FlagSync CLI generated types (manual type specification or inference as `unknown`):
 * ```ts
 * const ctx = { userId: 'user456' };
 *
 * const layout = useFlag<'v1' | 'v2'>('layout');             // Type: 'v1' | 'v2'
 * const discount = useFlag<number>('price-discount');        // Type: number
 * const enabled = useFlag<boolean>('enable-feature', false); // Type: boolean (defaultValue must be true or false)
 *
 * // Without an explicit generic (and no generated types), the return type is `unknown`:
 * const someDynamicKey = useFlag('some-dynamic-key');        // Type: unknown
 * ```
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
