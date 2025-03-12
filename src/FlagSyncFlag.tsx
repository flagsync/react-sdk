import { ReactNode, useMemo } from 'react';

import { useFlag } from '~sdk/use-flag';
import type { UseFlagValue } from '~sdk/use-flag';

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
  const { value, isReady, isReadyFromStore } = useFlag<T>(
    flagKey,
    defaultValue,
  );

  const childrenProps = useMemo(() => {
    return {
      value,
      isReady,
      isReadyFromStore,
    };
  }, [value, isReady, isReadyFromStore]);

  return children(childrenProps);
}
