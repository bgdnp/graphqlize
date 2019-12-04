import { TParameter } from './parameter'

export type TUnionDefinition = {
  name: string
  types: Function[]
  resolver?: Function
  parameters?: TParameter[]
}

export type TUnionDefinitionsMap = {
  [name: string]: TUnionDefinition
}

export type TCreateUnionOptions = {
  name?: string
  types: Function[]
}
