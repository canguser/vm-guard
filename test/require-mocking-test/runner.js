const { runInProcess } = require('../../lib');
(async () => {

  const result = await runInProcess(
    `
        module.exports = require('../a');
    `,
    {
      timeout: 10 * 1000,
      compilePath: ['.*'],
      allowedModules: ['.*'],
      requireMocking: {
        '^\/asdasd\/': {
          '../': '@/'
        }
      }
    },
    '/asdasd/vm.js'
  );

  console.log(result);

})();