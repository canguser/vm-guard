const { VmGuard } = require('../lib');

const vm = new VmGuard({
  timeout: 30000,
  require: {
    external: {
      modules: ['@scope/*-ver-??']
    }
  },
  globalAsync: true,
  noHardwareLimit: true
});

(async () => {
  console.log(await vm.run(`
            const instanceType = require('./erqe');
            return instanceType;
        `, 'vm.js'));
})();