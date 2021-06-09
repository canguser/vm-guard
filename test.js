const { VmGuard } = require('./lib');

let debug = require('debug');
// debug.enable('vm-guard');

(async () => {

  const vm = new VmGuard({
    sandbox: {
      a: ' test'
    }
  });

  try {
    await Promise.all([
      vm.run('console.log(\'1\' + a)'),
      vm.run('console.log(\'2\' + a)'),
      vm.run('console.log(\'3\' + a)'),
      vm.run('console.log(\'4\' + a)'),
      vm.run('console.log(\'5\' + a)'),
      vm.run(`
      while(true){}
    `)
    ]);
  } catch (e) {
    console.log(e);
  } finally {
    vm.destroy();
  }


})();