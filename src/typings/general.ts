import { TQueryDefinition } from './query'
import { TTypeDefinitionsMap } from './type'
import { TInterfaceDefinitionsMap } from './interface'
import { TUnionDefinitionsMap } from './union'
import { TInputDefinitionsMap } from './input'

export type TDefinitions = {
  query: TQueryDefinition
  mutation: TQueryDefinition
  types: TTypeDefinitionsMap
  interfaces: TInterfaceDefinitionsMap
  unions: TUnionDefinitionsMap
  inputs: TInputDefinitionsMap
}
