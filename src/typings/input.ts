import { TFieldDefinitionsMap } from './field'

export type TInputDefinition = {
  name: string
  fields: TFieldDefinitionsMap
}

export type TInputDefinitionsMap = {
  [name: string]: TInputDefinition
}
