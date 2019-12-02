import 'reflect-metadata'

export { Query } from './decorators/query.decorator'
export { Param } from './decorators/param.decorator'
export { Parent } from './decorators/parent.decorator'
export { Context } from './decorators/context.decorator'
export { Info } from './decorators/info.decorator'
export { Type } from './decorators/type.decorator'
export { Field } from './decorators/field.decorator'

export { createSchema } from './create-schema'

export class Int extends Number {}
export class Float extends Number {}
export class ID extends String {}
