import { SimpleRunOptions } from './simple-run';
import * as pt from 'path';
import * as fs from 'fs';
import { ModuleMatcher } from './interface/guard.options';

declare const cacheResolves: { [key: string]: any };

function meetExps(test: string, exps: Array<string | RegExp | ModuleMatcher>): ModuleMatcher[] | void {

  const matchers = exps.map<ModuleMatcher>(exp => {
    if (typeof exp === 'string' || (exp instanceof RegExp)) {
      return {
        role: exp,
        children: []
      };
    }
    return exp;
  });

  const matches = matchers.filter(matcher => new RegExp(matcher.role).test(test));
  if (!matches || matches.length === 0) {
    return void 0;
  }
  return matches;

}

function isModulePath(path: string): boolean {
  return !path.startsWith('.') && !path.startsWith('/');
}

const vmRequire = require;

function getMockModule(options: SimpleRunOptions, run, require) {

  const { compilePath = [], allowedModules = [], legacyRequire, innerRunnerName, compatibleRequire, requireMocking = {} } = options || {};

  let mockExports = {};

  const mockRequire = legacyRequire ? vmRequire : new Proxy((path) => {
      const thisRequire = compatibleRequire ? vmRequire : require;
      path = String(path).trim();

      // require mocking
      const mockingPaths = Object.keys(requireMocking);
      mocking: for (const filePathReg of mockingPaths) {
        const reg = new RegExp(filePathReg);
        if (reg.test(__filename)) {
          const mocking = requireMocking[filePathReg] || {};
          const keys = Object.keys(mocking);
          for (const key of keys) {
            if (path.startsWith(key)) {
              path = path.replace(key, mocking[key]);
              break mocking;
            }
          }
        }
      }

      // inner runner
      if (options.allowInnerRunner && path === innerRunnerName) {
        return {
          run: (script, opt, path: string = './inner-vm-runner.js') => run(
            script,
            { ...options, ...opt },
            path.startsWith('/') ? path : pt.join(__dirname, path)
          )
        };
      }


      if (options.moduleName && path.startsWith('.')) {
        try {
          const modulePath = require.resolve(options.moduleName);
          const modulePrefix = modulePath.split(options.moduleName)[0] + options.moduleName;
          const targetFullPath = pt.join(__dirname, path);
          path = targetFullPath.replace(modulePrefix, options.moduleName);
        } catch (e) {
          // ignore
        }
      }

      const statPath = path;
      const matchedMatchers = meetExps(path, allowedModules);

      if (!matchedMatchers) {
        throw new Error('Access denied, require failed: ' + path);
      }

      const innerOptions = { ...options };
      innerOptions.allowedModules = [...allowedModules, ...(matchedMatchers.map(m => m.children).flat(1))]
        .filter(m => m);

      let moduleName = '';
      if (path.startsWith('.')) {
        path = pt.join(__dirname, path);
      } else if (!path.startsWith('/')) {
        moduleName = path.split('/')[0] || '';
      }

      if (moduleName ? !meetExps(statPath, compilePath) : !meetExps(path, compilePath)) {
        return thisRequire(path);
      }

      let detailPath;
      try {
        detailPath = require.resolve(path);
        if (isModulePath(detailPath)) {
          return thisRequire(path);
        }
      } catch (e) {
        return thisRequire(path);
      }

      if (detailPath in cacheResolves) {
        return cacheResolves[detailPath];
      }
      const script = fs.readFileSync(detailPath, 'utf8');
      const result = run(script, {
        ...innerOptions,
        wrapper: 'commonjs',
        moduleName
      }, detailPath);
      cacheResolves[detailPath] = result;
      return result;
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

module.exports = function(script, ctx, vm, options, run, require, path = './vm.js') {

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

  const runSnippet = vm.code(scriptWrapped, path, options);
  const result = runSnippet(context);
  return options.wrapper === 'none' ? result : (mockModule.exports || {});
};