import { FsFlagSet } from '@flagsync/js-sdk';
import { useMemo } from 'react';

import { useFlagSyncClient } from '~sdk/use-flagsync-client';

/**
 * Hook to get multiple flags with the given default values.
 * @param defaultValues
 */
export function useFlags(defaultValues: FsFlagSet = {}): FsFlagSet {
  const client = useFlagSyncClient();

  return useMemo(() => {
    return client.flags(defaultValues);
  }, [client.lastUpdated]);
}
