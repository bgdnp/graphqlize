import { TFieldDefinitionsMap, TQueryOptions, TParameter } from '../typings'
import { TYPE_FIELDS_METADATA, PROPERTY_TYPE, PARAMETERS_METADATA, FUNCTION_RETURN_TYPE } from '../constants'
import { processQueryOptions } from '../helpers'

export function Field(typeOrOptions?: Function | [Function] | TQueryOptions): MethodDecorator & PropertyDecorator {
  let { type, options } = processQueryOptions(typeOrOptions)

  return (target: any, name: string, descriptor?: any): void => {
    const fields: TFieldDefinitionsMap = Reflect.getOwnMetadata(TYPE_FIELDS_METADATA, target) || {}
    const isResolverMethod: boolean = Boolean(descriptor && descriptor.value)
    const metadataKey: string = isResolverMethod ? FUNCTION_RETURN_TYPE : PROPERTY_TYPE
    const resolver: Function = isResolverMethod ? target[name] : undefined
    const parameters: TParameter[] = isResolverMethod
      ? Reflect.getOwnMetadata(PARAMETERS_METADATA, target, name)
      : undefined

    type = type || Reflect.getOwnMetadata(metadataKey, target, name).name
    options = options || {
      isRequired: true,
      isList: false,
      isListRequired: false,
    }

    fields[name] = { name, type, options, resolver, parameters }

    Reflect.defineMetadata(TYPE_FIELDS_METADATA, fields, target)
  }
}
