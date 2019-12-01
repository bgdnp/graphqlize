import { storage } from '../utilities/storage'
import { FUNCTION_RETURN_TYPE, PARAMETERS_METADATA } from '../constants'
import { TParameter, TQueryOptions, TTypeOptions } from '../typings'

export function Query(typeOrOptions?: Function | [Function] | TQueryOptions): MethodDecorator {
  return (target: any, propertyKey: string) => {
    let type: string
    let options: TTypeOptions

    if (typeof typeOrOptions === 'function') {
      type = typeOrOptions.name
      options = {
        isRequired: true,
        isList: false,
        isListRequired: false,
      }
    } else if (Array.isArray(typeOrOptions)) {
      type = typeOrOptions[0].name
      options = {
        isRequired: true,
        isList: true,
        isListRequired: true,
      }
    } else if (typeof typeOrOptions === 'object') {
      if (typeof typeOrOptions.type === 'function') {
        type = typeOrOptions.type.name
        options = {
          isRequired: !typeOrOptions.nullable,
          isList: false,
          isListRequired: !typeOrOptions.nullableList,
        }
      } else if (Array.isArray(typeOrOptions.type)) {
        type = typeOrOptions.type[0].name
        options = {
          isRequired: !typeOrOptions.nullable,
          isList: true,
          isListRequired: !typeOrOptions.nullableList,
        }
      }
    } else {
      type = Reflect.getOwnMetadata(FUNCTION_RETURN_TYPE, target, propertyKey).name
      options = {
        isRequired: true,
        isList: false,
        isListRequired: false,
      }
    }

    const parameters: TParameter[] = Reflect.getOwnMetadata(PARAMETERS_METADATA, target, propertyKey) || []

    storage.addQueryField({
      name: propertyKey,
      type: type,
      resolver: target[propertyKey],
      parameters,
      options,
    })
  }
}
