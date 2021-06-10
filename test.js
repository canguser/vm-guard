const { VmGuard } = require('./lib');

let debug = require('debug');
debug.enable('vm-guard');

(async () => {

  const vm = new VmGuard({
    sandbox: {
      a: ' test'
    }, // vm2 的 options
    concurrency: 2 // 并发限制
  });

  try {
    await Promise.all([
      // 以下输出由于在多线程下，不会以特定顺序输出
      vm.run('console.log(\'1\' + a)'),
      vm.run('console.log(\'2\' + a)'),
      vm.run('console.log(\'3\' + a)'),
      vm.run('console.log(\'4\' + a)'),
      vm.run('console.log(\'5\' + a)'),
      // 运行恶意代码会导致超时
      // vm.run(`
      //   while(true){}
      // `)
    ]);
  } catch (e) {
    // 捕获超时或其它异常
    console.log(e);
  }

  // 也可以在一段时间后运行，其子进程会自动管理，调度
  setTimeout(() => {
    vm.run('console.log(\'6\' + a)');
    vm.run('console.log(\'17\' + a)');
    vm.run('console.log(\'18\' + a)');
  }, 2000);


})();