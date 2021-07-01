const { runInProcess } = require('../../lib');


(async () => {

  const fs = await runInProcess(
    `
        const a = require('./a'); // 引入依赖 ./a.js
        a.c = 1000;
        const b = require('./a');
        module.exports = b;
    `,
    {
      compilePath: ['.*'], // 指定所有依赖都在沙箱执行
      allowedModules: ['^\\..*'] // 只允许引用相对路径的依赖
    }
  );

  console.log(fs);

})();