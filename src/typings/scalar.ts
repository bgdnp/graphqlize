import { GraphQLScalarSerializer, GraphQLScalarValueParser, GraphQLScalarLiteralParser } from 'graphql'

export type TScalarDefinition = {
  name: string
  serialize: GraphQLScalarSerializer<any>
  parseValue?: GraphQLScalarValueParser<any>
  parseLiteral?: GraphQLScalarLiteralParser<any>
}

export type TScalarDefinitionsMap = {
  [name: string]: TScalarDefinition
}
