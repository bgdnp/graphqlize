import { TFieldDefinitionsMap } from './field'

export type TInterfaceDefinition = {
  name: string
  fields: TFieldDefinitionsMap
}

export type TInterfaceDefinitionsMap = {
  [name: string]: TInterfaceDefinition
}
