const { runInProcess } = require('../../lib');
const { run } = require('../../lib/simple-run');

async function run0() {
  return runInProcess(
    `
        const a = await new Promise((r,j)=>{
          setTimeout(()=>{
            j(new Error('dasd'))
            r(100)
          }, 0)
        })
        return a;
    `,
    {
      globalAsync: true,
      timeout: 10 * 1000
    },
    './mmmmm.js'
  );
}

async function run1() {
  return run(
    `
        console.log(__filename)
        throw new Error('asdasff')
    `,
    {},
    './mmmmm.js'
  );
}

async function run2() {
  return run(
    `
        console.log(__filename)
        throw new Error('asdasff')
    `,
    {},
    '/dasds/dsfds/mmmmm.js'
  );
}

(async () => {

  try {
    return await run0();
  } catch (e) {
    console.log(e.stack);
  }

  try {
    return await run1();
  } catch (e) {
    console.log(e.stack);
  }

  try {
    return await run2();
  } catch (e) {
    console.log(e.stack);
  }

})();