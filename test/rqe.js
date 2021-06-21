const { run } = require('../lib');

(async () => {
  const code = `
  console.log(process)
  const fs = require('fs')
  return fs.statSync('/')
`;

  console.log(
    await run(code, {
      allowedModules: ['.*'],
      allowedVariables: ['.*'],
      legacyRequire: false,
      sandbox:{
        require:123,
        process: 123
      },
      wrapper: 'none'
    })
  );
})();

