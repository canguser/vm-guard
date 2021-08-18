const { runInProcess } = require('../../lib');

async function run() {
  return runInProcess(
    `
        console.log(__dirname+ '/inner')
        module.paths.push(__dirname)
        return require('inner')(5,7)
    `,
    {
      globalAsync: true,
      allowedModules: ['.*'],
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
a.then(r=>console.log(r))