export type TQueryDefinition = {
  name: string
  fields: TFieldDefinitionsMap
}

export type TFieldDefinitionsMap = {
  [name: string]: TFieldDefinition
}

export type TFieldDefinition = {
  name: string
  type: string
  resolver?: Function
  parameters?: TParameter[]
  options?: TTypeOptions
}

export type TParameter = {
  kind: string
  index: number
  name?: string
  type?: string
  options?: TTypeOptions
}

export type TDefinitions = {
  query: TQueryDefinition
  types: TTypeDefinitionsMap
  interfaces: TInterfaceDefinitionsMap
}

export type TTypeOptions = {
  isRequired?: boolean
  isList?: boolean
  isListRequired?: boolean
}

export type TQueryOptions = {
  type?: Function | [Function]
  nullable: boolean
  nullableList?: boolean
}

export type TParamOptions = {
  type?: Function | [Function]
  nullable?: boolean
  nullableList?: boolean
}

export type TTypeDefinition = {
  name: string
  fields: TFieldDefinitionsMap
}

export type TTypeDefinitionsMap = {
  [name: string]: TTypeDefinition
}

export type TInterfaceDefinition = {
  name: string
  fields: TFieldDefinitionsMap
}

export type TInterfaceDefinitionsMap = {
  [name: string]: TTypeDefinition
}
