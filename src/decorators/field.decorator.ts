import { TFieldDefinitionsMap, TQueryOptions } from '../typings'
import { TYPE_FIELDS_METADATA, PROPERTY_TYPE } from '../constants'
import { processQueryOptions } from '../helpers'

export function Field(typeOrOptions?: Function | [Function] | TQueryOptions): PropertyDecorator {
  let { type, options } = processQueryOptions(typeOrOptions)

  return (target: any, name: string) => {
    const fields: TFieldDefinitionsMap = Reflect.getOwnMetadata(TYPE_FIELDS_METADATA, target) || {}

    type = type || Reflect.getOwnMetadata(PROPERTY_TYPE, target, name).name
    options = options || {
      isRequired: true,
      isList: false,
      isListRequired: false,
    }

    fields[name] = { name, type, options }

    Reflect.defineMetadata(TYPE_FIELDS_METADATA, fields, target)
  }
}
