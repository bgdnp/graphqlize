import { TQueryDefinition } from './query'
import { TTypeDefinitionsMap } from './type'
import { TInterfaceDefinitionsMap } from './interface'
import { TUnionDefinitionsMap } from './union'
import { TInputDefinitionsMap } from './input'
import { TScalarDefinitionsMap } from './scalar'

export type TDefinitions = {
  query: TQueryDefinition
  mutation: TQueryDefinition
  subscription: TQueryDefinition
  types: TTypeDefinitionsMap
  interfaces: TInterfaceDefinitionsMap
  unions: TUnionDefinitionsMap
  inputs: TInputDefinitionsMap
  scalars: TScalarDefinitionsMap
}

export type TCreateSchemaOptions = {
  resolvers?: Function[]
  rootTypes?: Function[]
  schemaFile?: string
}
