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
            type: 'dateFile',
            filename: './test.log'
          }
        },
        categories: {
          default: {
            appenders: ['std', 'file'],
            level: 'INFO'
          }
        }
      }
    }
  );

  console.log(a);

})();