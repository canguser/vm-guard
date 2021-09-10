const { ProcessManager } = require('../../../lib/pm/process-manager');

const pm = new ProcessManager({ concurrency: 1, latencyTime: 2000 });


for (let i = 0; i < 20; i++) {
  // pm.load('./logic')
  //   .then(r => console.log(r + i));
  pm.exec('./logic', 'sum', [1000, i])
    .then(r => console.log(r));
}
