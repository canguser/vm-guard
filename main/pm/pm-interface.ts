export interface PmOptions {
  concurrency?: number;
  memoryQuota?: number;
  cpuQuota?: number;
  noHardwareLimit?: boolean;
  latencyTime?: number
}

export enum ProcessEventType {
  CALL_CHILD,
  CALL_PARENT,
  CHILD_RETURN,
  PARENT_RETURN
}