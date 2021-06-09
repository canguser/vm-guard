import { ProcessMessageType } from '../enum/process.message.type';

export interface ProcessMessage {
  type: ProcessMessageType,
  detail: {
    [key: string]: any
  }
}