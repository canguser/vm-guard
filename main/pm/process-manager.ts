import { PmOptions } from './pm-interface';
import { CallableChildProcess } from './callable-child-process';
import * as childProcess from 'child_process';
import * as pt from 'path';
import { firstSuccessPromise, wait } from '../utils';

const defaultOptions: PmOptions = {
  concurrency: 2,
  cpuQuota: 0.5,
  memoryQuota: 125,
  noHardwareLimit: false,
  latencyTime: 2000
};

export class ProcessManager {

  private options: PmOptions;

  private processes: CallableChildProcess[] = [];

  constructor(options?: PmOptions) {
    this.options = {
      ...defaultOptions,
      ...options
    };
  }

  private cpFunctions = {
    destroy() {
      this.destroy();
    }
  };

  async getProcess() {
    let cp;
    if (this.processes.length < this.options.concurrency) {
      const process = childProcess.fork(require.resolve(pt.join(__dirname, './process-executor.js')), []);
      console.log('new process', process.pid);
      cp = new CallableChildProcess(process);
      cp.addFunctions(this.cpFunctions);
      this.processes.push(cp);
    } else {
      cp = await firstSuccessPromise([...this.processes].map(p => this.fetchProcess(p)));
      if (!cp) {
        cp = await this.getProcess();
      }
    }
    return cp;
  }

  async fetchProcess(cp: CallableChildProcess) {
    try {
      await Promise.race([
        cp.caller.ping(),
        wait(2000).then(() => Promise.reject('Fetch timeout'))
      ]);
      return cp;
    } catch (e) {
      cp.destroy();
      this.processes = this.processes.filter(p => p !== cp);
      return Promise.reject(e);
    }
  }

  public async load(scriptPath: string): Promise<any> {
    const cp = await this.getProcess();
    return cp.caller.load(pt.resolve(process.cwd(), scriptPath), this.options.latencyTime);
  }

  public async exec(path: string, method: string, args?: any[]) {
    const cp = await this.getProcess();
    return cp.caller.exec(pt.resolve(process.cwd(), path), method, args || [], this.options.latencyTime);
  }

}