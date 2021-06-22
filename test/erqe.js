const { run } = require('../lib');

(async () => {
  const code = `
  console.log(process)
  const fs = require('fs')
  const state = require('./rqe.js')
  console.log(state)
  // module.exports = fs.statSync('/')
  return 100
`;

  console.log(
    run(code, {
      allowedModules: ['fs'],
      requireChain: ['.*'],
      wrapper: 'none'
    })
  );
})();

