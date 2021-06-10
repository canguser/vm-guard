vm-guard / [Modules](modules.md)

# VM Guard for Javascript

> A more secure multi thread sandbox for NodeJS

> `VM Guard` 是基于 `VM2` 的 `NodeJS` 沙箱环境，用于解决一些在 `VM2` 中不能解决的问题

## 与 `VM2` 不同的特征
> `VM2` 是一款作用于 `Javascript` 的沙箱环境（[开源地址](https://github.com/patriksimek/vm2)）

1. 多线程增加运行沙箱代码的运行速率
2. 新增 `timeout` (超时)可遏制在 `NodeJS` 环境下 `VM2` 所不能解决的恶意代码，如：
    ```javascript
    while (true) {}
    ```
3. 可以限定每个线程的 CPU 或者 内存 占用（仅支持 `Linux`）
3. `VM2` 仅支持 `NodeJS` 环境（浏览器环境的支持可能需要使用到 `Worker`, 尽情期待）

## 与 `VM2` 的兼容
- `VM Guard` 可以使用所有 `VM2` 中 [`NodeVM` 的配置选项](https://github.com/patriksimek/vm2#nodevm)
- 除此之外提供以下额外选项
    |选项名|默认值|描述|
    |-|-|-|
    |`concurrency`|`2`|并发数量|
    |`timeout`|`1000`|包含异步/同步操作的超时时间（单位 ms）|
    |`memoryQuota`|`1000`|最大能使用的内存（单位 m）|
    |`cpuQuota`|`0.5`|cpu 资源配额（百分比）|

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
      // 以下输出由于在多线程下，不会以特定顺序输出
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
