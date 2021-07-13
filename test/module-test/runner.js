const { runInProcess } = require('../../lib');


(async () => {

  const fs = await runInProcess(
    `
        const a = require('test-tako-connector-sdk@1.0.15'); // 引入依赖 module
        module.exports = a;
    `,
    {
      compilePath: ['.*'], // 指定所有依赖都在沙箱执行
      allowedModules: [
        {
          role: '^test-tako-connector-sdk.*$',
          children: ['.*']
        }
      ] // 只允许引用相对路径的依赖
    }
  );

  console.log(fs);

})();