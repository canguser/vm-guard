import {Worker} from '../worker';

export interface WorkerHost {
  onWorkerActive(worker: Worker): void
}