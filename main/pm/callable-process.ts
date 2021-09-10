import { ProcessEventType } from './pm-interface';
import { v4 as uuidV4 } from 'uuid';

type PromiseFunction<T = any> = (...args) => Promise<T>

export abstract class CallableProcess {

  public caller: { [key: string]: PromiseFunction };
  protected pendingCalls: any[] = [];
  public respondent: { [key: string]: (...args) => any } = {};
  protected abstract callOutType: ProcessEventType;
  protected abstract callInType: ProcessEventType;
  protected abstract returnType: ProcessEventType;
  protected abstract responseType: ProcessEventType;

  protected constructor(public origin: any) {
    this.initCaller();
    this.initRespondent();
  }

  private initRespondent() {
    this.origin.on('message', async (message: any = {}) => {
      if (message.type === this.callInType) {
        const { args, id, method } = message;
        let returnValue, error;
        try {
          returnValue = await this.respondent[method].apply(this, args);
        } catch (e) {
          error = e;
        }
        if (this.isAvailable()) {
          this.origin.send({
            type: this.responseType, id,
            returnValue, error
          });
        }
      }
      if (message.type === this.returnType) {
        for (const { callback } of [...this.pendingCalls]) {
          if (callback(message)) {
            break;
          }
        }
      }
    });
  }

  protected isAvailable() {
    return true;
  }

  public addFunctions(map = {}) {
    Object.assign(this.respondent, map);
  }

  private initCaller() {
    this.caller = new Proxy({}, {
      get: (target: any, p: string | symbol): any => {
        return (...args) => {
          return new Promise((resolve, reject) => {

            const uniqueId = uuidV4();

            const callback = (message: any = {}) => {
              if (message.type === this.returnType) {
                const { id, error, returnValue } = message;
                if (id === uniqueId) {
                  this.pendingCalls = this.pendingCalls.filter(call => call.id !== id);
                  if (!error) {
                    resolve(returnValue);
                  } else {
                    reject(error);
                  }
                  return true;
                }
                return false;
              }
            };

            this.pendingCalls.push({
              id: uniqueId,
              callback,
              method: p,
              args
            });

            if (this.isAvailable()) {
              this.origin.send({
                type: this.callOutType,
                method: p, args,
                id: uniqueId
              });
            } else {
              callback({
                type: this.returnType,
                id: uniqueId,
                error: new Error('Process is not available')
              });
            }
          });
        };
      }
    });
  }


}