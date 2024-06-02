import { FsClient } from '@flagsync/js-sdk';

export interface DecoratedFsClient extends FsClient {
  lastUpdated: number;
  isReady: boolean;
  isReadyFromStore: boolean;
}
