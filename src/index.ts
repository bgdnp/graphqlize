import 'reflect-metadata'

export { Query } from './decorators/query.decorator'
export { Param } from './decorators/param.decorator'

export { createSchema } from './create-schema'

export class Int extends Number {}
export class Float extends Number {}
export class ID extends String {}
