import { GraphQLSchema } from 'graphql'
import { Generator } from './utilities/generator'
import { TCreateSchemaOptions } from './typings'

export function createSchema(options: TCreateSchemaOptions): GraphQLSchema {
  const generator = new Generator()

  return generator.createSchema()
}
