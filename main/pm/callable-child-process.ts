import { CallableProcess } from './callable-process';
import { ChildProcess } from 'child_process';
import { ProcessEventType } from './pm-interface';

export class CallableChildProcess extends CallableProcess {


  protected callInType: ProcessEventType = ProcessEventType.CALL_PARENT;
  protected callOutType: ProcessEventType = ProcessEventType.CALL_CHILD;
  protected responseType: ProcessEventType = ProcessEventType.PARENT_RETURN;
  protected returnType: ProcessEventType = ProcessEventType.CHILD_RETURN;

  constructor(public origin: ChildProcess) {
    super(origin);
  }

  protected isAvailable(): boolean {
    return !this.origin.killed && this.origin.connected;
  }

  get pid() {
    return this.origin.pid;
  }

  get connected() {
    return this.origin.connected;
  }

  destroy() {
    this.origin.removeAllListeners('message');
    this.origin.removeAllListeners('disconnect');

    this.pendingCalls.forEach(({ callback, id }) => {
      callback({
        id,
        error: new Error('Child Process Destroyed'),
        type: this.returnType
      });
    });

    if (this.origin.connected) this.origin.disconnect();
    if (!this.origin.killed) this.origin.kill('SIGKILL');
  }

}