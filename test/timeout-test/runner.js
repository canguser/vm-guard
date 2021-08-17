const { runInProcess } = require('../../lib');

async function run() {
  return runInProcess(
    `
        const a = await new Promise(r=>{
          setTimeout(()=>{
            r(100)
          }, 20000)
        })
        return a;
    `,
    {
      globalAsync: true,
      timeout: 10 * 1000
    }
  );
}

const a = (async () => {

  try {
    return await run();
  } catch (e) {
    console.log(e);
  }

})();