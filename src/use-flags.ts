import { FsFlagSet } from '@flagsync/js-sdk';

import { useFlagSyncClient } from '~sdk/use-flagsync-client';

/**
 * Hook to get multiple flags with the given default values.
 * @param defaultValues
 */
export function useFlags(defaultValues: FsFlagSet = {}): FsFlagSet {
  const client = useFlagSyncClient();
  return client.flags(defaultValues);
}
