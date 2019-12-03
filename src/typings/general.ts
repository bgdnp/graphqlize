import { TQueryDefinition } from './query'
import { TTypeDefinitionsMap } from './type'
import { TInterfaceDefinitionsMap } from './interface'

export type TDefinitions = {
  query: TQueryDefinition
  types: TTypeDefinitionsMap
  interfaces: TInterfaceDefinitionsMap
}
