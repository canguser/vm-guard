[vm-guard](../README.md) / [Modules](../modules.md) / [interface/guard.options](../modules/interface_guard_options.md) / GuardOptions

# Interface: GuardOptions

[interface/guard.options](../modules/interface_guard_options.md).GuardOptions

## Hierarchy

- `NodeVMOptions`

  ↳ **GuardOptions**

## Table of contents

### Properties

- [argv](interface_guard_options.guardoptions.md#argv)
- [compiler](interface_guard_options.guardoptions.md#compiler)
- [concurrency](interface_guard_options.guardoptions.md#concurrency)
- [console](interface_guard_options.guardoptions.md#console)
- [cpuQuota](interface_guard_options.guardoptions.md#cpuquota)
- [env](interface_guard_options.guardoptions.md#env)
- [eval](interface_guard_options.guardoptions.md#eval)
- [fixAsync](interface_guard_options.guardoptions.md#fixasync)
- [memoryQuota](interface_guard_options.guardoptions.md#memoryquota)
- [nesting](interface_guard_options.guardoptions.md#nesting)
- [require](interface_guard_options.guardoptions.md#require)
- [sandbox](interface_guard_options.guardoptions.md#sandbox)
- [sourceExtensions](interface_guard_options.guardoptions.md#sourceextensions)
- [timeout](interface_guard_options.guardoptions.md#timeout)
- [wasm](interface_guard_options.guardoptions.md#wasm)
- [wrapper](interface_guard_options.guardoptions.md#wrapper)

## Properties

### argv

• `Optional` **argv**: `string`[]

Array of arguments passed to `process.argv`.
This object will not be copied and the script can change this object.

#### Inherited from

NodeVMOptions.argv

#### Defined in

node_modules/vm2/index.d.ts:81

___

### compiler

• `Optional` **compiler**: ``"javascript"`` \| ``"coffeescript"`` \| `CompilerFunction`

`javascript` (default) or `coffeescript` or custom compiler function (which receives the code, and it's filepath).
 The library expects you to have coffee-script pre-installed if the compiler is set to `coffeescript`.

#### Inherited from

NodeVMOptions.compiler

#### Defined in

node_modules/vm2/index.d.ts:40

___

### concurrency

• `Optional` **concurrency**: `number`

#### Defined in

[main/interface/guard.options.ts:4](https://github.com/canguser/vm-guard/blob/a9ff35a/main/interface/guard.options.ts#L4)

___

### console

• `Optional` **console**: ``"inherit"`` \| ``"redirect"`` \| ``"off"``

`inherit` to enable console, `redirect` to redirect to events, `off` to disable console (default: `inherit`).

#### Inherited from

NodeVMOptions.console

#### Defined in

node_modules/vm2/index.d.ts:68

___

### cpuQuota

• `Optional` **cpuQuota**: `number`

#### Defined in

[main/interface/guard.options.ts:7](https://github.com/canguser/vm-guard/blob/a9ff35a/main/interface/guard.options.ts#L7)

___

### env

• `Optional` **env**: `any`

Environment map passed to `process.env`.
This object will not be copied and the script can change this object.

#### Inherited from

NodeVMOptions.env

#### Defined in

node_modules/vm2/index.d.ts:86

___

### eval

• `Optional` **eval**: `boolean`

If set to `false` any calls to eval or function constructors (`Function`, `GeneratorFunction`, etc) will throw an
`EvalError` (default: `true`).

#### Inherited from

NodeVMOptions.eval

#### Defined in

node_modules/vm2/index.d.ts:52

___

### fixAsync

• `Optional` **fixAsync**: `boolean`

If set to `true` any attempt to run code using async will throw a `VMError` (default: `false`).

#### Inherited from

NodeVMOptions.fixAsync

#### Defined in

node_modules/vm2/index.d.ts:60

___

### memoryQuota

• `Optional` **memoryQuota**: `number`

#### Defined in

[main/interface/guard.options.ts:6](https://github.com/canguser/vm-guard/blob/a9ff35a/main/interface/guard.options.ts#L6)

___

### nesting

• `Optional` **nesting**: `boolean`

`true` to enable VMs nesting (default: `false`).

#### Inherited from

NodeVMOptions.nesting

#### Defined in

node_modules/vm2/index.d.ts:72

___

### require

• `Optional` **require**: ``true`` \| `VMRequire`

`true` or an object to enable `require` options (default: `false`).

#### Inherited from

NodeVMOptions.require

#### Defined in

node_modules/vm2/index.d.ts:70

___

### sandbox

• `Optional` **sandbox**: `any`

VM's global object.

#### Inherited from

NodeVMOptions.sandbox

#### Defined in

node_modules/vm2/index.d.ts:42

___

### sourceExtensions

• `Optional` **sourceExtensions**: `string`[]

File extensions that the internal module resolver should accept.

#### Inherited from

NodeVMOptions.sourceExtensions

#### Defined in

node_modules/vm2/index.d.ts:76

___

### timeout

• `Optional` **timeout**: `number`

#### Overrides

NodeVMOptions.timeout

#### Defined in

[main/interface/guard.options.ts:5](https://github.com/canguser/vm-guard/blob/a9ff35a/main/interface/guard.options.ts#L5)

___

### wasm

• `Optional` **wasm**: `boolean`

If set to `false` any attempt to compile a WebAssembly module will throw a `WebAssembly.CompileError` (default: `true`).

#### Inherited from

NodeVMOptions.wasm

#### Defined in

node_modules/vm2/index.d.ts:56

___

### wrapper

• `Optional` **wrapper**: ``"commonjs"`` \| ``"none"``

`commonjs` (default) to wrap script into CommonJS wrapper, `none` to retrieve value returned by the script.

#### Inherited from

NodeVMOptions.wrapper

#### Defined in

node_modules/vm2/index.d.ts:74
