import { GuardOptions } from './interface/guard.options';
import { Worker } from './worker';
import { ProcessState } from './enum/process.state';
import { Script } from './script';
import { WorkerHost } from './interface/WorkerHost';

const log = require('debug')('vm-guard');

const defaultOptions: GuardOptions = {
  timeout: 500,
  concurrency: 4,
  cpuQuota: 0.5,
  memoryQuota: 500
};

export class VmGuard implements WorkerHost {

  workers: Worker[] = [];
  pendingScripts: Script[] = [];
  options: GuardOptions;

  constructor(options: GuardOptions = {}) {
    this.options = {
      ...defaultOptions,
      ...options
    };
  }

  async run(script: string) {
    const scriptEntity = new Script(script, this.options.timeout);
    const worker = this.getWorker();
    if (!worker) {
      this.pendingScripts.push(scriptEntity);
      return scriptEntity.getScriptResult();
    }
    return worker.runScript(scriptEntity);
  }

  onWorkerActive(worker: Worker) {
    if (this.pendingScripts.length > 0) {
      worker.runScript(this.pendingScripts.shift());
    }
  }

  getWorker() {
    let activeWorker = this.getActivityWorker();
    if (!activeWorker && this.workers.length < this.options.concurrency) {
      activeWorker = new Worker(this.options);
      activeWorker.bindHost(this);
      this.workers.push(activeWorker);
    }
    return activeWorker;
  }

  getActivityWorker() {
    return this.workers.find(worker => worker.state === ProcessState.ACTIVE);
  }

  destroy() {
    for (const worker of this.workers) {
      worker.destroy();
    }
  }

  adjustWorks() {
    this.workers = this.workers.filter(worker => worker.state !== ProcessState.DESTROY);
  }

  onWorkerDestroy(worker: Worker): void {
    this.adjustWorks();
  }

}