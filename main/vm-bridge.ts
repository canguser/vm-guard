import { SimpleRunOptions } from './simple-run';
import * as pt from 'path';
import * as fs from 'fs';

function meetExps(test: string, exps: Array<string | RegExp>) {
  return exps.some(exp => new RegExp(exp).test(test));
}

const vmRequire = require;

function getMockModule(options: SimpleRunOptions, run, require) {

  const { compilePath = [], allowedModules = [], legacyRequire, innerRunnerName, compatibleRequire } = options || {};

  let mockExports = {};

  const mockRequire = legacyRequire ? vmRequire : new Proxy((path) => {
      const thisRequire = compatibleRequire ? vmRequire : require;
      path = String(path);
      if (options.allowInnerRunner && path === innerRunnerName) {
        return { run: (script, opt, path?: string) => run(script, { ...options, ...opt }, path) };
      }
      if (!meetExps(path, allowedModules)) {
        throw new Error('Access denied, require failed: ' + path);
      }
      if (!meetExps(path, compilePath)) {
        if (path.startsWith('.')) {
          path = pt.join(__dirname, path);
        }
        return thisRequire(path);
      }
      if (path.startsWith('.')) {
        path = pt.join(__dirname, path);
      }
      let detailPath;
      try {
        detailPath = require.resolve(path);
      } catch (e) {
        return thisRequire(path);
      }
      const script = fs.readFileSync(detailPath, 'utf8');
      return run(script, {
        ...options,
        wrapper: 'commonjs'
      }, detailPath);
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

module.exports = function(script, ctx, vm, options, run, require) {

  const mockModule = getMockModule(options, run, require);

  function isInModule(p: string): boolean {
    return (p in mockModule.mock);
  }

  const context = new Proxy(ctx, {

    has: (target, p) => {
      return Reflect.has(target, p) || isInModule(<string>p);
    },

    get(target, p, receiver) {

      if (isInModule(<string>p)) {
        return mockModule.mock[p];
      }

      return Reflect.get(target, p, receiver);
    }

  });

  let scriptWrapped = `
    module.exports = function(__ctx){
      with(__ctx){
        ${script}
      }
      return __ctx.module.exports
    }
  `;

  if (options.wrapper === 'none') {
    scriptWrapped = `
        return function(__ctx){
          with(__ctx){
            ${script}
          }
        }
    `;
  }

  const runSnippet = vm.code(scriptWrapped, './vm.js', options);
  const result = runSnippet(context);
  return options.wrapper === 'none' ? result : (mockModule.exports || {});
};