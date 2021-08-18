import { GuardOptions } from './interface/guard.options';
import { ProcessMessage } from './interface/process.message';
import { ProcessMessageType } from './enum/process.message.type';
import { run } from './simple-run';

async function runScript(script: string, options?: GuardOptions, path?: string) {
  return run(script, options, path);
}

function getAsyncScript(script: string) {
  return `
    module.exports = (async function(){
        ${script}
    })();
  `;
}

async function dealMessage(message: ProcessMessage) {
  if (message.type === ProcessMessageType.RUN_SCRIPT) {
    let { script, options = {}, path = './' } = message.detail || {};
    const { globalAsync } = options;
    if (script) {
      if (globalAsync) {
        script = getAsyncScript(script);
        options.wrapper = 'commonjs';
      }
      try {
        let result = await runScript(script, options, path);

        if (globalAsync) {
          result = await result;
        }

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