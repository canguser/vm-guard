const { run } = require('../lib');

(async () => {
  const code = `
  console.log(process)
  const fs = require('fs')
  module.exports = fs.statSync('/')
`;

  console.log(
    await run(code, {
      allowedModules: ['.*'],
      allowedVariables: ['.*'],
      legacyRequire: false,
      sandbox:{
        require:123,
        process: 123
      }
    })
  );
})();

