import { TFieldDefinitionsMap } from './field'

export type TQueryDefinition = {
  name: string
  fields: TFieldDefinitionsMap
}

export type TCreateQueryOptions = {
  type?: string | Function | [Function]
  nullable: boolean
  nullableList?: boolean
}
