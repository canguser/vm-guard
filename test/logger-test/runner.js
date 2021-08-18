const { runInProcess } = require('../../lib');

(async () => {

  const a = await runInProcess(
    `
        const a = require('./a'); // 引入依赖 ./a.js
        module.exports = a;
    `,
    {
      allowedModules: ['^\\..*'],
      compilePath: ['.*'],
      loggerConfigure: {
        appenders: {
          std: {
            type: 'stdout'
          },
          file: {
            type: 'fileSync',
            filename: '/Users/ryan/WebstormProjects/project/vm-guard/test/logger-test/connector/logs/connector/c70ef2d6-ba3d-4649-9ec7-9f2be3d87741.log'
          }
        },
        categories: {
          default: {
            appenders: ['std', 'file'],
            level: 'all'
          }
        }
      }
    }
  );

  console.log(a);

})();