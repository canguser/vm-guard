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
      try {
        const result = await Promise.resolve(await runScript(script, options));
        process.send({
          type: ProcessMessageType.RETURN,
          detail: {
            result
          }
        });
      } catch (e) {
        process.send({
          type: ProcessMessageType.SCRIPT_ERROR,
          detail: {
            error: {
              name: e.name,
              message: e.message,
              stack: e.stack
            }
          }
        });
      }
    }
  }
}

process.on('message', dealMessage);

process.send({ type: ProcessMessageType.READY });