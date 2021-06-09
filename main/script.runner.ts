import { NodeVM } from 'vm2';
import { GuardOptions } from './interface/guard.options';
import { ProcessMessage } from './interface/process.message';
import { ProcessMessageType } from './enum/process.message.type';

async function runScript(script: string, options?: GuardOptions) {
  const vm = new NodeVM(options);
  return vm.run(script);
}

async function dealMessage(message: ProcessMessage) {
  if (message.type === ProcessMessageType.RUN_SCRIPT) {
    const { script, options = {} } = message.detail || {};
    if (script) {
      const result = await Promise.resolve(await runScript(script, options));
      process.send({
        type: ProcessMessageType.RETURN,
        detail: {
          result
        }
      });
    }
  }
}

process.on('message', dealMessage);

process.send({ type: ProcessMessageType.READY });