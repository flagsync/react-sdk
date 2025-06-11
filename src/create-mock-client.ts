import type { FsEventType, FsEventTypePayload } from '@flagsync/js-sdk';

import type { DecoratedFsClient } from '~sdk/types';

type Callback<T extends FsEventType> = (payload: FsEventTypePayload[T]) => void;

const noop = () => {};
const warn = (...msg: any[]) => {
  console.warn('[FlagSync]', ...msg);
};

export class MockFlagSyncClient {
  public isReady = false;
  public isReadyFromStore = false;
  public isError = true;
  public lastUpdated = 0;

  constructor(private readonly initError: unknown) {}

  flag<T>(_flagKey: string, defaultValue?: T): T {
    warn(`flag("${_flagKey}") called, but SDK failed to initialize.`);
    return defaultValue as T;
  }

  flags(_defaultValues?: Record<string, any>) {
    warn(`flags() called, but SDK failed to initialize.`);
    return {};
  }

  track(eventKey: string, value?: number | null, props?: Record<string, any>) {
    warn(`track("${eventKey}") called, but SDK failed to initialize.`, {
      value,
      props,
    });
  }

  kill() {
    warn(`kill() called, but SDK failed to initialize.`);
  }

  on<T extends FsEventType>(event: T, _callback: Callback<T>) {
    warn(`on("${event}") called, but SDK failed to initialize.`);
  }

  once<T extends FsEventType>(event: T, _callback: Callback<T>) {
    warn(`once("${event}") called, but SDK failed to initialize.`);
  }

  off<T extends FsEventType>(event: T, _callback?: Callback<T>) {
    warn(`off("${event}") called, but SDK failed to initialize.`);
  }

  async waitForReady(): Promise<void> {
    warn(`waitForReady() called, but SDK failed to initialize.`);
  }

  async waitForReadyCanThrow(): Promise<void> {
    warn(`waitForReadyCanThrow() called, but SDK failed to initialize.`);
    throw this.initError instanceof Error
      ? this.initError
      : new Error('FlagSync failed to initialize');
  }
}

export function createMockClient(initError: unknown): DecoratedFsClient {
  return new MockFlagSyncClient(initError) as unknown as DecoratedFsClient;
}
