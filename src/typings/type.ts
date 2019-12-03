import { TFieldDefinitionsMap } from './index'

export type TTypeDefinition = {
  name: string
  fields: TFieldDefinitionsMap
  interfaces: string[]
}

export type TTypeDefinitionsMap = {
  [name: string]: TTypeDefinition
}

export type TCreateTypeOptions = {
  name?: string
  interfaces?: Function[]
}

export type TTypeOptions = {
  isRequired?: boolean
  isList?: boolean
  isListRequired?: boolean
}
