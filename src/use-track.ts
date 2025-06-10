import { useFlagSyncProviderContext } from '~sdk/flagsync-provider';

export type TrackFunction = (
  eventKey: string,
  value?: number | null | undefined,
  properties?: Record<string, unknown> | undefined,
) => void;

export type TrackFunctionWithEventKey = (
  value?: number | null,
  properties?: Record<string, unknown>,
) => void;

/**
 * This hook is used to track events in the FlagSync SDK, and is
 * pre-filled with the specified "eventKey".
 * @param eventKey
 */
export function useTrack(eventKey: string): TrackFunctionWithEventKey;

/**
 * This hook is used to track events in the FlagSync SDK.
 */
export function useTrack(): TrackFunction;

/**
 * This hook is used to track events in the FlagSync SDK.
 *
 * @param eventKey The event key to track.
 * @returns A function to track the event.
 */
export function useTrack(eventKey?: string) {
  if (eventKey && typeof eventKey !== 'string') {
    throw new Error('eventKey must be a string or undefined');
  }
  /**
   * We don't need to listen so no need to use "useFlagSyncClient".
   */
  const { client } = useFlagSyncProviderContext();

  if (typeof eventKey === 'string') {
    return (value?: number | null, properties?: Record<string, unknown>) =>
      client.track(eventKey, value, properties);
  }

  return (
    eventKey: string,
    value?: number | null | undefined,
    properties?: Record<string, unknown>,
  ) => client.track(eventKey, value, properties);
}
