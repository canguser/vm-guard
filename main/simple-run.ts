'use strict';
import { NodeVM, NodeVMOptions } from '@palerock/vm2';
import Vm from 'vm';
import * as fs from 'fs';
import * as pt from 'path';
import { ModuleStringMatcher } from './interface/guard.options';
import { Configuration, configure, getLogger } from 'log4js';

export interface SimpleRunOptions extends NodeVMOptions {
  sandbox?: { [key: string]: any }
  allowedVariables?: Array<string | RegExp>,
  allowedModules?: ModuleStringMatcher[],
  allowInnerRunner?: boolean,
  innerRunnerName?: string,
  compilePath?: Array<string | RegExp>,
  legacyRequire?: boolean,
  compatibleRequire?: boolean,
  moduleName?: string,
  loggerConfigure?: Configuration,
  loggerPrefix?: string,
  requireMocking?: {
    [filePath: string]: {
      [requirePath: string]: string
    }
  },
  emptyRequire?: boolean
}

// @ts-ignore
declare const arguments: Array<any>;

const _global = global || {};

const globalProperties: Array<string | symbol> = Object.getOwnPropertyNames(_global);
const globalArguments = {
  module, exports, __filename, __dirname, arguments, require
};

const defaultOptions: SimpleRunOptions = {
  allowedVariables: [],
  allowedModules: [],
  legacyRequire: false,
  wrapper: 'commonjs',
  innerRunnerName: '@@vm-guard',
  allowInnerRunner: true,
  compilePath: [],
  compatibleRequire: false,
  moduleName: '',
  loggerPrefix: '',
  emptyRequire: false
};

const cacheResolves: { [key: string]: any } = {};

function meetExps(test: string, exps: Array<string | RegExp>) {
  return exps.some(exp => new RegExp(exp).test(test));
}

export function run(script: string, options: SimpleRunOptions = {}, path: string = './vm.js') {
  options = { ...defaultOptions, ...options };
  const cwd = path.startsWith('/') ? pt.join(path, '../') : process.cwd();
  const filename = pt.join(cwd, './vm-bridge.js');
  let { sandbox, allowedVariables = [], loggerConfigure, loggerPrefix } = options;

  let mockConsole: any = console;

  if (loggerConfigure) {
    try {
      configure(loggerConfigure);
      const logger = getLogger(loggerPrefix || filename);
      const loggerMethods = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'mark'];
      mockConsole = new Proxy(console, {
        get(target: Console, p: string | symbol, receiver: any): any {
          if (p === 'log') {
            return logger.info.bind(logger);
          }
          if (typeof p === 'string' && loggerMethods.includes(p)) {
            try {
              return logger[p].bind(logger);
            } catch (e) {
              console.warn('[warn] log4js logged failed once.', e?.stack);
            }
          }
          return Reflect.get(target, p, receiver);
        }
      });
    } catch (e) {
      console.warn('vm logs initialize failed, ', e);
    }
  }

  if (!sandbox) {
    options.sandbox = sandbox = {};
  }

  if (!('console' in sandbox)) {
    sandbox.console = mockConsole;
  }

  const mockGlobalArguments = {
    ...globalArguments
  };

  function isMeetGlobalArguments(p: string): boolean {
    return (p in mockGlobalArguments) && meetExps(<string>p, allowedVariables);
  }

  function isMeetGlobalProperties(p: string): boolean {
    return globalProperties.includes(p) && meetExps(<string>p, allowedVariables);
  }

  const context = new Proxy(Object.create(null), {

    has: (target, p) =>
      !(p in sandbox) &&
      (
        Reflect.has(target, p) ||
        isMeetGlobalArguments(<string>p) ||
        isMeetGlobalProperties(<string>p)
      ),

    get(target, p, receiver) {
      if (isMeetGlobalProperties(<string>p)) {
        return _global[p];
      }
      if (isMeetGlobalArguments(<string>p)) {
        return mockGlobalArguments[p];
      }
      return Reflect.get(target, p, receiver);
    },

    set(target: any, p: string | symbol, value: any, receiver: any): boolean {
      return Reflect.set(target, p, value, receiver);
    }

  });

  const bridgeContext = {
    module, exports, require, cacheResolves,
    __filename: filename,
    __dirname: pt.join(filename, '../'),
    console
  };

  const runSnippet = Vm.runInNewContext(
    fs.readFileSync(
      require.resolve('./vm-bridge'), 'utf8'
    ), bridgeContext, {
      filename
    }
  );

  return runSnippet(script, context, NodeVM, options, run, require, path);
}