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
  resolver: Function
  parameters: TParameter[]
}

export type TParameter = {
  kind: string
  index: number
  name?: string
  type?: string
}

export type TDefinitions = {
  query: TQueryDefinition
}
