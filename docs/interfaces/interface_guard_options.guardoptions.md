[vm-guard](../README.md) / [Modules](../modules.md) / [interface/guard.options](../modules/interface_guard_options.md) / GuardOptions

# Interface: GuardOptions

[interface/guard.options](../modules/interface_guard_options.md).GuardOptions

## Hierarchy

- `SimpleRunOptions`

  ↳ **GuardOptions**

## Table of contents

### Properties

- [allowInnerRunner](interface_guard_options.guardoptions.md#allowinnerrunner)
- [allowedModules](interface_guard_options.guardoptions.md#allowedmodules)
- [allowedVariables](interface_guard_options.guardoptions.md#allowedvariables)
- [argv](interface_guard_options.guardoptions.md#argv)
- [compatibleRequire](interface_guard_options.guardoptions.md#compatiblerequire)
- [compilePath](interface_guard_options.guardoptions.md#compilepath)
- [compiler](interface_guard_options.guardoptions.md#compiler)
- [concurrency](interface_guard_options.guardoptions.md#concurrency)
- [console](interface_guard_options.guardoptions.md#console)
- [cpuQuota](interface_guard_options.guardoptions.md#cpuquota)
- [env](interface_guard_options.guardoptions.md#env)
- [eval](interface_guard_options.guardoptions.md#eval)
- [fixAsync](interface_guard_options.guardoptions.md#fixasync)
- [globalAsync](interface_guard_options.guardoptions.md#globalasync)
- [innerRunnerName](interface_guard_options.guardoptions.md#innerrunnername)
- [legacyRequire](interface_guard_options.guardoptions.md#legacyrequire)
- [loggerConfigure](interface_guard_options.guardoptions.md#loggerconfigure)
- [loggerPrefix](interface_guard_options.guardoptions.md#loggerprefix)
- [memoryQuota](interface_guard_options.guardoptions.md#memoryquota)
- [moduleName](interface_guard_options.guardoptions.md#modulename)
- [nesting](interface_guard_options.guardoptions.md#nesting)
- [noHardwareLimit](interface_guard_options.guardoptions.md#nohardwarelimit)
- [require](interface_guard_options.guardoptions.md#require)
- [sandbox](interface_guard_options.guardoptions.md#sandbox)
- [sourceExtensions](interface_guard_options.guardoptions.md#sourceextensions)
- [timeout](interface_guard_options.guardoptions.md#timeout)
- [wasm](interface_guard_options.guardoptions.md#wasm)
- [wrapper](interface_guard_options.guardoptions.md#wrapper)

## Properties

### allowInnerRunner

• `Optional` **allowInnerRunner**: `boolean`

#### Inherited from

SimpleRunOptions.allowInnerRunner

#### Defined in

[main/simple-run.ts:13](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L13)

___

### allowedModules

• `Optional` **allowedModules**: [ModuleStringMatcher](../modules/interface_guard_options.md#modulestringmatcher)[]

#### Inherited from

SimpleRunOptions.allowedModules

#### Defined in

[main/simple-run.ts:12](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L12)

___

### allowedVariables

• `Optional` **allowedVariables**: (`string` \| `RegExp`)[]

#### Inherited from

SimpleRunOptions.allowedVariables

#### Defined in

[main/simple-run.ts:11](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L11)

___

### argv

• `Optional` **argv**: `string`[]

Array of arguments passed to `process.argv`.
This object will not be copied and the script can change this object.

#### Inherited from

SimpleRunOptions.argv

#### Defined in

node_modules/@palerock/vm2/index.d.ts:81

___

### compatibleRequire

• `Optional` **compatibleRequire**: `boolean`

#### Inherited from

SimpleRunOptions.compatibleRequire

#### Defined in

[main/simple-run.ts:17](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L17)

___

### compilePath

• `Optional` **compilePath**: (`string` \| `RegExp`)[]

#### Inherited from

SimpleRunOptions.compilePath

#### Defined in

[main/simple-run.ts:15](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L15)

___

### compiler

• `Optional` **compiler**: ``"javascript"`` \| ``"coffeescript"`` \| `CompilerFunction`

`javascript` (default) or `coffeescript` or custom compiler function (which receives the code, and it's filepath).
 The library expects you to have coffee-script pre-installed if the compiler is set to `coffeescript`.

#### Inherited from

SimpleRunOptions.compiler

#### Defined in

node_modules/@palerock/vm2/index.d.ts:40

___

### concurrency

• `Optional` **concurrency**: `number`

#### Defined in

[main/interface/guard.options.ts:4](https://github.com/canguser/vm-guard/blob/2dbe098/main/interface/guard.options.ts#L4)

___

### console

• `Optional` **console**: ``"inherit"`` \| ``"redirect"`` \| ``"off"``

`inherit` to enable console, `redirect` to redirect to events, `off` to disable console (default: `inherit`).

#### Inherited from

SimpleRunOptions.console

#### Defined in

node_modules/@palerock/vm2/index.d.ts:68

___

### cpuQuota

• `Optional` **cpuQuota**: `number`

#### Defined in

[main/interface/guard.options.ts:7](https://github.com/canguser/vm-guard/blob/2dbe098/main/interface/guard.options.ts#L7)

___

### env

• `Optional` **env**: `any`

Environment map passed to `process.env`.
This object will not be copied and the script can change this object.

#### Inherited from

SimpleRunOptions.env

#### Defined in

node_modules/@palerock/vm2/index.d.ts:86

___

### eval

• `Optional` **eval**: `boolean`

If set to `false` any calls to eval or function constructors (`Function`, `GeneratorFunction`, etc) will throw an
`EvalError` (default: `true`).

#### Inherited from

SimpleRunOptions.eval

#### Defined in

node_modules/@palerock/vm2/index.d.ts:52

___

### fixAsync

• `Optional` **fixAsync**: `boolean`

If set to `true` any attempt to run code using async will throw a `VMError` (default: `false`).

#### Inherited from

SimpleRunOptions.fixAsync

#### Defined in

node_modules/@palerock/vm2/index.d.ts:60

___

### globalAsync

• `Optional` **globalAsync**: `boolean`

#### Defined in

[main/interface/guard.options.ts:9](https://github.com/canguser/vm-guard/blob/2dbe098/main/interface/guard.options.ts#L9)

___

### innerRunnerName

• `Optional` **innerRunnerName**: `string`

#### Inherited from

SimpleRunOptions.innerRunnerName

#### Defined in

[main/simple-run.ts:14](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L14)

___

### legacyRequire

• `Optional` **legacyRequire**: `boolean`

#### Inherited from

SimpleRunOptions.legacyRequire

#### Defined in

[main/simple-run.ts:16](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L16)

___

### loggerConfigure

• `Optional` **loggerConfigure**: `Configuration`

#### Inherited from

SimpleRunOptions.loggerConfigure

#### Defined in

[main/simple-run.ts:19](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L19)

___

### loggerPrefix

• `Optional` **loggerPrefix**: `string`

#### Inherited from

SimpleRunOptions.loggerPrefix

#### Defined in

[main/simple-run.ts:20](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L20)

___

### memoryQuota

• `Optional` **memoryQuota**: `number`

#### Defined in

[main/interface/guard.options.ts:6](https://github.com/canguser/vm-guard/blob/2dbe098/main/interface/guard.options.ts#L6)

___

### moduleName

• `Optional` **moduleName**: `string`

#### Inherited from

SimpleRunOptions.moduleName

#### Defined in

[main/simple-run.ts:18](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L18)

___

### nesting

• `Optional` **nesting**: `boolean`

`true` to enable VMs nesting (default: `false`).

#### Inherited from

SimpleRunOptions.nesting

#### Defined in

node_modules/@palerock/vm2/index.d.ts:72

___

### noHardwareLimit

• `Optional` **noHardwareLimit**: `boolean`

#### Defined in

[main/interface/guard.options.ts:8](https://github.com/canguser/vm-guard/blob/2dbe098/main/interface/guard.options.ts#L8)

___

### require

• `Optional` **require**: ``true`` \| `VMRequire`

`true` or an object to enable `require` options (default: `false`).

#### Inherited from

SimpleRunOptions.require

#### Defined in

node_modules/@palerock/vm2/index.d.ts:70

___

### sandbox

• `Optional` **sandbox**: `Object`

#### Index signature

▪ [key: `string`]: `any`

#### Inherited from

SimpleRunOptions.sandbox

#### Defined in

[main/simple-run.ts:10](https://github.com/canguser/vm-guard/blob/2dbe098/main/simple-run.ts#L10)

___

### sourceExtensions

• `Optional` **sourceExtensions**: `string`[]

File extensions that the internal module resolver should accept.

#### Inherited from

SimpleRunOptions.sourceExtensions

#### Defined in

node_modules/@palerock/vm2/index.d.ts:76

___

### timeout

• `Optional` **timeout**: `number`

#### Overrides

SimpleRunOptions.timeout

#### Defined in

[main/interface/guard.options.ts:5](https://github.com/canguser/vm-guard/blob/2dbe098/main/interface/guard.options.ts#L5)

___

### wasm

• `Optional` **wasm**: `boolean`

If set to `false` any attempt to compile a WebAssembly module will throw a `WebAssembly.CompileError` (default: `true`).

#### Inherited from

SimpleRunOptions.wasm

#### Defined in

node_modules/@palerock/vm2/index.d.ts:56

___

### wrapper

• `Optional` **wrapper**: ``"commonjs"`` \| ``"none"``

`commonjs` (default) to wrap script into CommonJS wrapper, `none` to retrieve value returned by the script.

#### Inherited from

SimpleRunOptions.wrapper

#### Defined in

node_modules/@palerock/vm2/index.d.ts:74
