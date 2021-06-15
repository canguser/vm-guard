import { NodeVMOptions } from 'vm2';

export interface GuardOptions extends NodeVMOptions {
  concurrency?: number;
  timeout?: number;
  memoryQuota?: number;
  cpuQuota?: number;
  noHardwareLimit?: boolean;
  globalAsync?: boolean;
}