export function firstSuccessPromise(promises) {
  return new Promise(async resolve => {
    let success = false;
    await Promise.all(promises.map(
      async p => {
        try {
          const r = await p;
          if (!success) {
            success = true;
            resolve(r);
          }
        } catch (e) {
          // ignore
        }
      }
    ));
    if (!success) {
      resolve(undefined);
    }
  });
}

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}