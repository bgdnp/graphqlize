import { TTypeOptions } from './index'

export type TParameter = {
  kind: string
  index: number
  name?: string
  type?: string
  options?: TTypeOptions
}

export type TCreateParamOptions = {
  type?: Function | [Function]
  nullable?: boolean
  nullableList?: boolean
}

export type TParamOptions = {
  isRequired?: boolean
  isList?: boolean
  isListRequired?: boolean
}
