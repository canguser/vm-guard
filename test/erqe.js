const { run } = require('../lib');

(async () => {
  const code = `
  console.log(process)
  const fs = require('fs')
  module.exports = fs.statSync('/')
  return 100
`;

  console.log(
    await run(code, {
      allowedModules: ['.*'],
      legacyRequire: false,
      wrapper: 'none'
    })
  );
})();

