import { CallablePrimaryProcess } from './callable-primary-process';

const primaryProcess = new CallablePrimaryProcess(process);

let waitId;

primaryProcess.addFunctions({

  load(path: string, wait = 2000) {
    if (waitId) {
      clearTimeout(waitId);
    }
    const result = require(path);
    waitId = setTimeout(() => {
      primaryProcess.caller.destroy()
        .catch(e => console.log(e));
    }, wait);
    return result;
  },

  ping() {
    return 1;
  },

  exec(path: string, method, args, wait) {
    if (waitId) {
      clearTimeout(waitId);
    }
    const result = require(path);
    waitId = setTimeout(() => {
      primaryProcess.caller.destroy()
        .catch(e => console.log(e));
    }, wait);
    return result[method](...args);
  }

});