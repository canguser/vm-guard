import { SimpleRunOptions } from '../simple-run';

export interface GuardOptions extends SimpleRunOptions {
  concurrency?: number;
  timeout?: number;
  memoryQuota?: number;
  cpuQuota?: number;
  noHardwareLimit?: boolean;
  globalAsync?: boolean;
}

export interface ModuleMatcher {
  role: string | RegExp,
  children?: ModuleStringMatcher[]
}

export type ModuleStringMatcher = string | RegExp | ModuleMatcher