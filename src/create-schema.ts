import { GraphQLSchema } from 'graphql'
import { Generator } from './utilities/generator'

export function createSchema(): GraphQLSchema {
  const generator = new Generator()

  return generator.createSchema()
}
