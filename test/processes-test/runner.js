const { VmGuard } = require('../../lib');

const vg = new VmGuard({
  globalAsync: true,
  timeout: 5000
});

vg.run(`
  return new Promise(r=>{
    setTimeout(()=>{
      console.log('test1')
      r();
    }, 1000);
  })
`);

vg.run(`
  return new Promise(r=>{
    setTimeout(()=>{
      console.log('test2')
         r();
 }, 1000);
  })
`);