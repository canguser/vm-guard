import { ProcessState } from './enum/process.state';
import * as childProcess from 'child_process';
import * as pt from 'path';
import { ChildProcess } from 'child_process';
import { ProcessMessageType } from './enum/process.message.type';
import { ProcessMessage } from './interface/process.message';
import { GuardOptions } from './interface/guard.options';
import { Script } from './script';
import { WorkerHost } from './interface/WorkerHost';

const log = require('debug')('vm-guard');

const childExecArgv = (process.execArgv || []).map(flag =>
  flag.includes('--inspect') ? '--inspect=0' : flag
);

export class Worker {

  pid: number;
  state: ProcessState = ProcessState.PREPARE;
  runner: string = './script.runner.js';
  process: ChildProcess;
  host: WorkerHost;

  currentScript: Script;

  constructor(private options?: GuardOptions, runner?: string) {
    if (runner) {
      this.runner = runner;
    }
    this.initProcess();
  }

  public bindHost(host: WorkerHost) {
    this.host = host;
  }

  private initProcess() {
    this.process = childProcess.fork(require.resolve(pt.join(__dirname, this.runner)), [], {
      execArgv: childExecArgv
    });
    this.pid = this.process.pid;
    log(`new process init, pid: ${this.pid}`);
    this.startListenEvent();
  }

  public defer(r: any) {
    if (this.currentScript) {
      this.currentScript.defer(r);
      this.finishScript();
    }
  }

  public deferError(e: any) {
    if (this.currentScript) {
      log('Before script error');
      this.currentScript.error(e);
      this.finishScript();
    }
  }

  private startListenEvent() {
    if (this.process) {
      this.process.once('message', (readyMessage: ProcessMessage) => {
        if (readyMessage.type === ProcessMessageType.READY) {
          this.process.on('message', (message: ProcessMessage) => {
            if (this.currentScript) {
              if (message.type === ProcessMessageType.RETURN) {
                const { result } = message.detail || {};
                this.defer(result);
              } else if (message.type === ProcessMessageType.SCRIPT_ERROR) {
                const { error } = message.detail || {};
                this.deferError(error);
              }
            }
          });
        }
      });
    }
  }

  private finishScript() {
    this.currentScript = null;
    this.state = ProcessState.ACTIVE;
    log(`process reactive, pid: ${this.pid}`);
    this.host.onWorkerActive(this);
  }

  private run(script: string): void {
    log(`running script, pid: ${this.pid}, script: \n${script}`);
    this.process.send({
        type: ProcessMessageType.RUN_SCRIPT, detail: { script, options: this.options }
      }
    );
  }

  public async runScript(script: Script) {
    script.bindWorker(this);
    this.state = ProcessState.RUNNING;
    this.currentScript = script;
    this.run(script.content);
    return script.assertStart();
  }

  public destroy(): boolean {
    this.process.removeAllListeners('message');
    this.process.removeAllListeners('disconnect');
    this.deferError('Process destroyed.');

    if (this.process.connected) this.process.disconnect();
    if (!this.process.killed) this.process.kill('SIGKILL');
    this.host.onWorkerDestroy(this);

    this.state = ProcessState.DESTROY;
    return true;
  }


}