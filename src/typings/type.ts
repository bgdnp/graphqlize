import { TFieldDefinitionsMap } from './index'

export type TTypeDefinition = {
  name: string
  fields: TFieldDefinitionsMap
}

export type TTypeDefinitionsMap = {
  [name: string]: TTypeDefinition
}

export type TTypeOptions = {
  isRequired?: boolean
  isList?: boolean
  isListRequired?: boolean
}
