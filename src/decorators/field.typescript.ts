import { TFieldDefinitionsMap, TTypeOptions } from '../typings'
import { TYPE_FIELDS_METADATA, PROPERTY_TYPE } from '../constants'

export function Field(): PropertyDecorator {
  return (target: any, name: string) => {
    const fields: TFieldDefinitionsMap = Reflect.getOwnMetadata(TYPE_FIELDS_METADATA, target) || {}
    const type: string = Reflect.getOwnMetadata(PROPERTY_TYPE, target, name).name
    const options: TTypeOptions = {
      isRequired: true,
      isList: false,
      isListRequired: false,
    }

    fields[name] = { name, type, options }

    Reflect.defineMetadata(TYPE_FIELDS_METADATA, fields, target)
  }
}
