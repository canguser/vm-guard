const { runInProcess, cGuard: { run } } = require('../../lib');


(async () => {

  const fs = await run(
    `
        module.exports = (async ()=>{
          const { run } = require('@@vm-guard');
          
          const a = run(
          \`
            const bf = Buffer.from('{"a":[1,2,3]}', 'utf8')
            
            function a(){
              return new Proxy({},{
                get(target,p ,r){
                  return function (){
                    return JSON.parse(bf.toString('utf8')).a
                  }
                }
            })
            }
            module.exports = JSON.parse(bf.toString('utf8')).a;
          \`
          )
          
          
          console.log('!!', a, a instanceof Array)
          
          return [];
        })()
    `,
    {
      compilePath: ['.*'], // 指定所有依赖都在沙箱执行
      allowedModules: ['^\\..*'], // 只允许引用相对路径的依赖,
      allowedVariables: ['Buffer', 'ArrayBuffer'],
      globalAsync: true,
      timeout: 2000
    }
  );

  console.log(fs, fs instanceof Array);

})();