const { NodeVM } = require('vm2');

const vm = new NodeVM({
  require: {
    external: true
  }
});
console.log(vm.run(`
    const {A} = require('./test1');
    const a = new A();
    console.log(a.call('return process')());
`, __filename));