import { ReactNode } from 'react';

import { useFlagSyncProviderContext } from '~sdk/flagsync-provider';
import { UseFlagValue, useFlag } from '~sdk/use-flag';

export type FlagSyncFlagProps<T> = {
  flagKey: string;
  defaultValue: T;
  children: ({
    value,
    isReady,
    isReadyFromStore,
  }: {
    value: UseFlagValue<T>;
    isReady: boolean;
    isReadyFromStore: boolean;
  }) => ReactNode;
};

/**
 * Component to get a flag with the given default value.
 * Follows the render props pattern.
 * @param flagKey
 * @param defaultValue
 * @param children
 * @constructor
 */
export function FlagSyncFlag<T>({
  flagKey,
  defaultValue,
  children,
}: FlagSyncFlagProps<T>) {
  const { client } = useFlagSyncProviderContext();
  const value = useFlag<T>(flagKey, defaultValue);

  return children({
    value,
    isReady: client.isReady,
    isReadyFromStore: client.isReadyFromStore,
  });
}
