import { TFieldDefinitionsMap } from './field'
import { TParameter } from './parameter'

export type TInterfaceDefinition = {
  name: string
  fields: TFieldDefinitionsMap
  resolver?: Function
  parameters?: TParameter[]
}

export type TInterfaceDefinitionsMap = {
  [name: string]: TInterfaceDefinition
}
