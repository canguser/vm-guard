import { GuardOptions } from './interface/guard.options';
import { VmGuard } from './vm.guard';

export * from './vm.guard';
export * as cGuard from './simple-run';


export async function runInProcess(script: string, options?: GuardOptions, path: string = './vm.js'): Promise<any> {
  options = { ...options };
  return new VmGuard(options).run(script, path);
}