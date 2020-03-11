import 'reflect-metadata'

export { Query } from './decorators/query.decorator'
export { Mutation } from './decorators/mutation.decorator'
export { Subscription } from './decorators/subscription.decorator'
export { Param } from './decorators/param.decorator'
export { Parent } from './decorators/parent.decorator'
export { Context } from './decorators/context.decorator'
export { Info } from './decorators/info.decorator'
export { Type } from './decorators/type.decorator'
export { Interface } from './decorators/interface.decorator'
export { Union } from './decorators/union.decorator'
export { Input } from './decorators/input.decorator'
export { Field } from './decorators/field.decorator'
export { Resolver } from './decorators/resolver.decorator'
export { FieldResolver } from './decorators/field-resolver.decorator'
export { ResolveType } from './decorators/resolve-type.decorator'
export { Overrides } from './decorators/overrides.decorator'

export { createSchema } from './create-schema'

export class Int extends Number {}
export class Float extends Number {}
export class ID extends String {}

export { printSchema } from 'graphql'
