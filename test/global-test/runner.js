const { runInProcess } = require('../../lib');


(async () => {

  const fs = await runInProcess(
    `
        console.log(global.Promise)
        const fetch = require('node-fetch');
        const resp = await fetch('https://baidu.com', {
          method: 'GET'
        })
        return await resp.buffer()
    `, {
      compilePath: [],
      allowedModules: ['.*'],
      sandbox: { a: 1 },
      globalAsync: true
    }
  );

  console.log(fs);

})();