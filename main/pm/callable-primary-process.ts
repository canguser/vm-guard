import { CallableProcess } from './callable-process';
import { ProcessEventType } from './pm-interface';

export class CallablePrimaryProcess extends CallableProcess {

  protected callInType: ProcessEventType = ProcessEventType.CALL_CHILD;
  protected callOutType: ProcessEventType = ProcessEventType.CALL_PARENT;
  protected responseType: ProcessEventType = ProcessEventType.CHILD_RETURN;
  protected returnType: ProcessEventType = ProcessEventType.PARENT_RETURN;

  constructor(public origin: NodeJS.Process) {
    super(origin);
  }

  get pid() {
    return this.origin.pid;
  }
}