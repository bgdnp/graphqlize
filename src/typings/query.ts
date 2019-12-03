import { TFieldDefinitionsMap } from './field'

export type TQueryDefinition = {
  name: string
  fields: TFieldDefinitionsMap
}

export type TCreateQueryOptions = {
  type?: Function | [Function]
  nullable: boolean
  nullableList?: boolean
}
