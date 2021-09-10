import { SimpleRunOptions } from '../simple-run';
import { ProcessManager } from '../pm/process-manager';
import * as pt from 'path';
import { wait } from '../utils';

export class VmGuard extends ProcessManager {

  timeout = 2000;

  async run(script: string, options?: SimpleRunOptions) {
    return Promise.race([
      this.exec(pt.resolve(__dirname, './script-runner'), 'run', [script, options]),
      wait(this.timeout).then(r => Promise.reject('Executing timeout.'))
    ]);
  }

}