'use strict';
import { NodeVM, NodeVMOptions } from 'vm2';

export interface SimpleRunOptions extends NodeVMOptions {
  sandbox?: { [key: string]: any }
  allowedVariables?: Array<string | RegExp>,
  allowedModules?: Array<string | RegExp>,
  legacyRequire?: boolean,
  wrapper?: 'commonjs' | 'none'
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
  wrapper: 'commonjs'
};

function meetExps(test: string, exps: Array<string | RegExp>) {
  return exps.some(exp => new RegExp(exp).test(test));
}

function getMockModule(allowedModules = []) {
  let mockExports = {};

  const mockRequire = new Proxy((path) => {
      path = String(path);
      if (!meetExps(path, allowedModules)) {
        throw new Error('Access denied, require failed: ' + path);
      }
      return require(path);
    },
    {});

  const mockModule = new Proxy(
    module,
    {
      get(target: NodeModule, p: string | symbol, receiver: any): any {
        if (p === 'exports') {
          return mockExports;
        }
        if (p === 'require') {
          return mockRequire;
        }
        return Reflect.get(target, p, receiver);
      },
      set(target: NodeModule, p: string | symbol, value: any, receiver: any): boolean {
        if (p === 'exports') {
          mockExports = value;
          return true;
        }
        return Reflect.set(target, p, value, receiver);
      }
    }
  );

  return new Proxy({
    exports: mockExports,
    mock: {
      module: mockModule,
      exports: mockModule.exports,
      require: mockRequire
    }
  }, {
    get(target: any, p: string | symbol, receiver: any): any {
      if (p === 'exports') {
        return mockExports;
      }
      return Reflect.get(target, p, receiver);
    }
  });
}

export async function run(script: string, options: SimpleRunOptions = {}) {
  options = { ...defaultOptions, ...options };

  const { sandbox = {}, allowedVariables = [], allowedModules = [], legacyRequire } = options;

  const mockModule = getMockModule(allowedModules);
  const mockGlobalArguments = {
    ...globalArguments,
    ...mockModule.mock
  };

  let scriptWrapped = `
    module.exports = function(context){
      with(context){
        ${script}
      }
      return context.module.exports
    }
  `;

  if (options.wrapper === 'none') {
    scriptWrapped = `
      return function(context){
        with(context){
          ${script}
        }
      }
    `;
  }

  allowedVariables.push(
    'module', 'exports'
  );

  allowedVariables.push('require');

  if (legacyRequire) {
    allowedVariables.pop();
  }

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
    }

  });

  const runSnippet = await NodeVM.code(scriptWrapped, '.vm.js', options);

  const result = await runSnippet(context);

  return options.wrapper === 'none' ? result : (mockModule.exports || {});
}