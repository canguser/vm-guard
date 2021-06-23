'use strict';
import { NodeVM, NodeVMOptions } from '@palerock/vm2';
import Vm from 'vm';
import * as fs from 'fs';
import * as pt from 'path';

export interface SimpleRunOptions extends NodeVMOptions {
  sandbox?: { [key: string]: any }
  allowedVariables?: Array<string | RegExp>,
  allowedModules?: Array<string | RegExp>,
  innerRunnerName?: string,
  compilePath?: Array<string | RegExp>,
  legacyRequire?: boolean,
  compatibleRequire?: boolean
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
  legacyRequire: false,
  wrapper: 'commonjs',
  innerRunnerName: '@@vm-guard',
  compilePath: [],
  compatibleRequire: false
};

function meetExps(test: string, exps: Array<string | RegExp>) {
  return exps.some(exp => new RegExp(exp).test(test));
}

export function run(script: string, options: SimpleRunOptions = {}, path?: string) {
  options = { ...defaultOptions, ...options };

  const { sandbox = {}, allowedVariables = [] } = options;

  const mockGlobalArguments = {
    ...globalArguments
  };

  function isMeetGlobalArguments(p: string): boolean {
    return (p in mockGlobalArguments) && meetExps(<string>p, allowedVariables);
  }

  function isMeetGlobalProperties(p: string): boolean {
    return globalProperties.includes(p) && meetExps(<string>p, allowedVariables);
  }

  function isGlobalProperty(p: string | symbol): boolean {
    return p === 'global';
  }

  const context = new Proxy(Object.create(null), {

    has: (target, p) =>
      !(p in sandbox) &&
      (
        Reflect.has(target, p) ||
        isGlobalProperty(p) ||
        isMeetGlobalArguments(<string>p) ||
        isMeetGlobalProperties(<string>p)
      ),

    get(target, p, receiver) {
      if (isGlobalProperty(p)) {
        return receiver;
      }
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

  const mockExports = {};

  const mockModule = {
    exports: mockExports
  };

  const filename = path ? path : pt.join(process.cwd(), './vm-bridge.js');

  const bridgeContext = {
    module: mockModule,
    exports: exports,
    require,
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

  return runSnippet(script, context, NodeVM, options, run, require);
}