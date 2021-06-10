import { GuardOptions } from './interface/guard.options';
import { Worker } from './worker';
import { ProcessState } from './enum/process.state';
import { Script } from './script';
import { WorkerHost } from './interface/WorkerHost';
import { CGroups } from './external/cgroups';

const log = require('debug')('vm-guard');

const defaultOptions: GuardOptions = {
  timeout: 1000,
  concurrency: 2,
  cpuQuota: 0.5,
  memoryQuota: 125
};

export class VmGuard implements WorkerHost {

  workers: Worker[] = [];
  pendingScripts: Script[] = [];
  options: GuardOptions;
  cgroups: CGroups;

  private onControlGroupCreated: Function[] = [];
  private isControlGroupCreated: boolean = false;

  constructor(options: GuardOptions = {}) {
    this.options = {
      ...defaultOptions,
      ...options
    };
    this.createControlGroup()
      .then(() => {
        log('CGroup Initialized');
        if (this.onControlGroupCreated.length > 0) {
          this.onControlGroupCreated.forEach(f => f());
        }
        this.onControlGroupCreated = [];
      })
      .catch(() => {
        log('CGroup Initialized failed');
        if (this.onControlGroupCreated.length > 0) {
          this.onControlGroupCreated.forEach(f => f());
        }
        this.onControlGroupCreated = [];
      });
  }

  private async waitingCGroupCreated() {
    if (this.isControlGroupCreated) {
      return Promise.resolve();
    }
    return new Promise<void>(resolve => {
      this.onControlGroupCreated.push(() => {
        this.isControlGroupCreated = true;
        resolve();
      });
    });
  }

  async run(script: string) {
    await this.waitingCGroupCreated();
    const scriptEntity = new Script(script, this.options.timeout);
    const worker = await this.getWorker();
    if (!worker) {
      this.pendingScripts.push(scriptEntity);
      return scriptEntity.getScriptResult();
    }
    return worker.runScript(scriptEntity);
  }

  get isAllWorkersFree() {
    log('checking for free');
    return this.workers.every(worker => worker.state === ProcessState.ACTIVE);
  }

  onWorkerActive(worker: Worker) {
    if (this.pendingScripts.length > 0) {
      worker.runScript(this.pendingScripts.shift()).catch(e => e); // promise error ignored;
    } else if (this.isAllWorkersFree) {
      log('all workers released');
      this.releaseAllWorker();
    }
  }

  private waitingSynchronousResolvers: Function[] = [];

  private async startWaitingSynchronous() {
    let resolver = () => undefined;
    const promise = new Promise<void>(resolve => {
      resolver = resolve;
    });
    if (this.waitingSynchronousResolvers.length === 0) {
      resolver();
    }
    this.waitingSynchronousResolvers.push(resolver);
    return promise;
  }

  private async endWaitingSynchronous() {
    const [, nextResolver] = this.waitingSynchronousResolvers;
    this.waitingSynchronousResolvers.shift();
    if (nextResolver) {
      nextResolver();
    }
  }

  private async newWorker(): Promise<Worker> {
    const targetWorker = new Worker(this.options);
    targetWorker.bindHost(this);
    await this.cgroups.addProcess(targetWorker.pid);
    this.workers.push(targetWorker);
    return targetWorker;
  }

  async getWorker() {
    let targetWorker = this.getActivityWorker();
    if (!targetWorker) {
      await this.startWaitingSynchronous();
      if (this.workers.length < this.options.concurrency) {
        targetWorker = await this.newWorker();
      }
      await this.endWaitingSynchronous();
    }
    return targetWorker;
  }

  getActivityWorker() {
    return this.workers.find(worker => worker.state === ProcessState.ACTIVE);
  }

  releaseAllWorker() {
    for (const worker of this.workers) {
      worker.destroy();
    }
    this.adjustWorks();
  }

  adjustWorks() {
    this.workers = this.workers.filter(worker => worker.state !== ProcessState.DESTROY);
  }

  onWorkerDestroy(worker: Worker): void {
    this.adjustWorks();
  }

  private createControlGroup(): Promise<void[][]> {
    this.cgroups = new CGroups('safeify');
    const { cpuQuota, memoryQuota } = this.options;
    return Promise.resolve(this.cgroups.set({
      cpu: { cfs_quota_us: 100000 * cpuQuota },
      memory: { limit_in_bytes: 1048576 * memoryQuota }
    }));
  }

}