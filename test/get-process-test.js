const { VmGuard } = require('../lib');

const vm = new VmGuard();

vm.run(`
  console.log('??');
  const a = function(){}
  const process = a.constructor("return process")()
  console.log('??', process);
`);