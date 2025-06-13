import type { FsFlagSet } from '@flagsync/js-sdk';
import { ReactNode, useMemo } from 'react';

import { useFlags } from './use-flags';

export type FlagSyncFlagProps = {
  defaultValues?: FsFlagSet;
  children: ({
    flags,
    isReady,
    isReadyFromStore,
  }: {
    flags: FsFlagSet;
    isReady: boolean;
    isReadyFromStore: boolean;
  }) => ReactNode;
};

/**
 * Component to get multiple flags with the given default values.
 * Follows the render props pattern.
 * @param defaultValues
 * @param children
 * @constructor
 */
export function FlagSyncFlags({ defaultValues, children }: FlagSyncFlagProps) {
  const { flags, isReady, isReadyFromStore } = useFlags(defaultValues);

  const childrenProps = useMemo(() => {
    return {
      flags,
      isReady,
      isReadyFromStore,
    };
  }, [flags, isReady, isReadyFromStore]);

  return children(childrenProps);
}
