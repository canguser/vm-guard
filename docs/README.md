vm-guard / [Modules](modules.md)

# VM Guard for NodeJS

> *A more secure multi thread sandbox for NodeJS.*
>
> `VM Guard` 是基于 `VM2` 的 `NodeJS` 沙箱环境，用于解决一些在 `VM2` 中不能解决的问题

## 与 `VM2` 不同的特征
> `VM2` 是一款作用于 `Javascript` 的沙箱环境（[其开源地址](https://github.com/patriksimek/vm2)）

1. 多进程增加运行沙箱代码的运行速率
1. 新增 `timeout` (超时)可遏制在 `NodeJS` 环境下 `VM2` 中 `NodeVM` 所不能解决的恶意代码，如：
    ```javascript
    while (true) {}
    ```
1. 可以限定每个进程的 CPU 或者 内存 占用（仅支持 `Linux`）
1. `vm-guard` 重写了 `vm2` 中的 `require` 实现，可以通过 `allowedModules` 属性自定义能够使用的模块
1. `vm-guard` 也对全局变量作出了限制，可以通过 `allowedVariables` 限制能使用的全局变量，比如 `__dirname`
1. 支持链式 `require`(通过 `compilePath` 指定)，在沙箱中被运行的代码如果依赖了其它代码，其引用的代码也会被运行在沙箱中，受到限制
    ```javascript
    // runner.js
    const { runInProcess } = require('vm-guard');

    (async () => {

      const fs = await runInProcess(
        `
            const a = require('./a'); // 引入依赖 ./a.js
            module.exports = a;
        `,
        {
          compilePath: ['.*'], // 指定所有依赖都在沙箱执行
          allowedModules: ['^\\..*'] // 只允许引用相对路径的依赖
        }
      );

      // 在运行到这步之前会报错：Error: Access denied, require failed: fs
      console.log(fs);

    })();

    // a.js
    const fs = require('fs'); // 依赖 fs 模块（这是非法的引用）
    module.exports = fs;
    ```
1. 增加一个 `@@vm-guard` 模块，其中包含一个 `run(script, options ?:)` 的方法，该模块只能在沙箱中调用，可以通过 `@@vm-guard` 引入

## 与 `VM2` 的兼容
- `VM Guard` 可以使用所有 `VM2` 中 [`NodeVM` 的配置选项](https://github.com/patriksimek/vm2#nodevm)
- 除此之外提供以下额外选项
    |选项名|默认值|描述|
    |-|-|-|
    |`concurrency`|`2`|并发数量|
    |`timeout`|`1000`|包含异步/同步操作的超时时间（单位 ms）|
    |`memoryQuota`|`100`|最大能使用的内存（单位 m）|
    |`cpuQuota`|`0.5`|cpu 资源配额（百分比）|
    |`globalAsync`|`false`|支持在代码块最外层使用`await`|
    |`noHardwareLimit`|`false`|取消所有的硬件限制，如 CPU，内存|
    |`legacyRequire`|`false`|使用 `vm2` 提供的 `require` 方法，默认使用 `VmGuard` 提供给的 `require` 方法|
    |`allowedModules`|`[]`|允许使用的模块，支持正则，不限定内部或外部，只有在 `legacyRequire` 为 `false` 时生效|
    |`allowedVariables`|`[]`|允许使用的真实的 Node 全局变量，支持正则，如果指定 `'process'`，那么 `process.exit()` 便可以退出程序|
    |`allowInnerRunner`|`true`|允许在沙箱中再开一个沙箱运行代码，一般通过 `const {run} = require('@@vm-guard')` 来使用|
    |`innerRunnerName`|`@@vm-guard`|多重沙箱的模块名|
    |`compilePath`|`[]`|需要运行在沙箱的依赖列表|
    |`compatibleRequire`|`false`|兼容 `vm2` 的 `require` 与 `legacyRequire` 不同的是 `allowedModules` 也会同时生效|

## 简单安装
```shall script
npm i vm-guard --save
```

## 简单使用
```javascript
const { VmGuard } = require('vm-guard');

(async () => {

  const vm = new VmGuard({
    sandbox: {
      a: ' test'
    }, // vm2 的 options
    concurrency: 2 // 并发限制
  });

  try {
    await Promise.all([
      // 以下输出由于在多进程下，不会以特定顺序输出
      vm.run('console.log(\'1\' + a)'),
      vm.run('console.log(\'2\' + a)'),
      vm.run('console.log(\'3\' + a)'),
      vm.run('console.log(\'4\' + a)'),
      vm.run('console.log(\'5\' + a)'),
      // 运行恶意代码会导致超时
      vm.run(`
        while(true){}
      `)
    ]);
  } catch (e) {
    // 捕获超时或其它异常
    console.log(e);
  }

  // 也可以在一段时间后运行，其子进程会自动管理，调度
  setTimeout(() => {
    vm.run('console.log(\'6\' + a)');
    vm.run('console.log(\'17\' + a)');
    vm.run('console.log(\'18\' + a)');
  }, 2000);

})();
```

## 使用多进程的限制

在使用多进程的前提下，配置属性会以序列化的形式在进程之间传递，所以配置文件不能使用非序列化的内容，如 `function`, `class`, `regexp` 等等。

> 为了解决这一问题，我们实现了链式的 `require` 定义，可以通过 `require` 将一些想要传递的方法等放在一个独立的文件里，然后通过 `require` 去引用。

## 详细 API 文档
[https://github.com/canguser/vm-guard/blob/master/docs](https://github.com/canguser/vm-guard/blob/master/docs)
