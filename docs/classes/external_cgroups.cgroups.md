[vm-guard](../README.md) / [Modules](../modules.md) / [external/cgroups](../modules/external_cgroups.md) / CGroups

# Class: CGroups

[external/cgroups](../modules/external_cgroups.md).CGroups

## Table of contents

### Constructors

- [constructor](external_cgroups.cgroups.md#constructor)

### Properties

- [name](external_cgroups.cgroups.md#name)
- [platform](external_cgroups.cgroups.md#platform)
- [resources](external_cgroups.cgroups.md#resources)
- [root](external_cgroups.cgroups.md#root)

### Methods

- [addProcess](external_cgroups.cgroups.md#addprocess)
- [set](external_cgroups.cgroups.md#set)

## Constructors

### constructor

• **new CGroups**(`name`, `root?`, `platform?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `root` | `string` | "/sys/fs/cgroup" |
| `platform` | `Platform` | `undefined` |

#### Defined in

[main/external/cgroups.ts:25](https://github.com/canguser/vm-guard/blob/513627e/main/external/cgroups.ts#L25)

## Properties

### name

• **name**: `string` = ""

#### Defined in

[main/external/cgroups.ts:23](https://github.com/canguser/vm-guard/blob/513627e/main/external/cgroups.ts#L23)

___

### platform

• **platform**: `string`

#### Defined in

[main/external/cgroups.ts:25](https://github.com/canguser/vm-guard/blob/513627e/main/external/cgroups.ts#L25)

___

### resources

• **resources**: `string`[] = []

#### Defined in

[main/external/cgroups.ts:24](https://github.com/canguser/vm-guard/blob/513627e/main/external/cgroups.ts#L24)

___

### root

• **root**: `string`

#### Defined in

[main/external/cgroups.ts:22](https://github.com/canguser/vm-guard/blob/513627e/main/external/cgroups.ts#L22)

## Methods

### addProcess

▸ **addProcess**(`pid`): `Promise`<void[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pid` | `number` |

#### Returns

`Promise`<void[]\>

#### Defined in

[main/external/cgroups.ts:56](https://github.com/canguser/vm-guard/blob/513627e/main/external/cgroups.ts#L56)

___

### set

▸ **set**(`resources`): `Promise`<void[][]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `resources` | [IResources](../interfaces/external_cgroups.iresources.md) |

#### Returns

`Promise`<void[][]\>

#### Defined in

[main/external/cgroups.ts:33](https://github.com/canguser/vm-guard/blob/513627e/main/external/cgroups.ts#L33)
