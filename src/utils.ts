import { FlagSyncFactory, FsErrorEvent, FsEvent } from '@flagsync/js-sdk';
import type { FsConfig } from '@flagsync/js-sdk';

import { DecoratedFsClient } from '~sdk/types';

export function getFlagSyncClient(config: FsConfig): DecoratedFsClient {
  const factory = FlagSyncFactory({
    ...config,
    metadata: {
      sdkName: '__SDK_NAME__',
      sdkVersion: '__SDK_VERSION__',
    },
  });
  const client = factory.client() as DecoratedFsClient;

  client.lastUpdated = 0;
  client.isReady = false;
  client.isReadyFromStore = false;
  client.isError = false;

  function setLastUpdated() {
    const now = Date.now();
    if (now > client.lastUpdated) {
      client.lastUpdated = now;
    }
  }

  function onReady() {
    client.isReady = true;
    client.isReadyFromStore = true;
    setLastUpdated();
  }

  function onReadyFromStore() {
    client.isReadyFromStore = true;
    setLastUpdated();
  }

  function onError(error: FsErrorEvent) {
    client.isError = true;
    console.error(`FlagSync: SDK initialization error (type: ${error.type})`);
    console.error(error.error);
  }

  client.on(FsEvent.SDK_UPDATE, setLastUpdated);
  client.on(FsEvent.SDK_READY, onReady);
  client.on(FsEvent.SDK_READY_FROM_STORE, onReadyFromStore);
  client.on(FsEvent.ERROR, onError);

  return client;
}
