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
}

export type TDefinitions = {
  query: TQueryDefinition
}
