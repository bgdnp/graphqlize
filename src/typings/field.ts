import { TParameter } from './index'

export type TFieldDefinitionsMap = {
  [name: string]: TFieldDefinition
}

export type TFieldDefinition = {
  name: string
  type: string
  resolver?: Function
  parameters?: TParameter[]
  options?: TFieldOptions
}

export type TCreateFieldOptions = {
  type?: string | Function | [Function]
  nullable: boolean
  nullableList?: boolean
}

export type TFieldOptions = {
  isRequired?: boolean
  isList?: boolean
  isListRequired?: boolean
}
