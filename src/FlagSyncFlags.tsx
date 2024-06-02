import { FsFlagSet } from '@flagsync/js-sdk';
import { ReactNode, useMemo } from 'react';

import { useFlagSyncProviderContext } from '~sdk/flagsync-provider';
import { useFlags } from '~sdk/use-flags';

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
  const { client } = useFlagSyncProviderContext();
  const flags = useFlags(defaultValues);

  const childrenProps = useMemo(() => {
    return {
      flags,
      isReady: client.isReady,
      isReadyFromStore: client.isReadyFromStore,
    };
  }, [flags, client.isReady, client.isReadyFromStore]);

  return children(childrenProps);
}
