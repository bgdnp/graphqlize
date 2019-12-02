import { storage } from '../utilities/storage'
import { FUNCTION_RETURN_TYPE, PARAMETERS_METADATA } from '../constants'
import { TParameter, TQueryOptions } from '../typings'
import { processQueryOptions } from '../helpers'

export function Query(typeOrOptions?: Function | [Function] | TQueryOptions): MethodDecorator {
  let { type, options } = processQueryOptions(typeOrOptions)

  return (target: any, propertyKey: string) => {
    const parameters: TParameter[] = Reflect.getOwnMetadata(PARAMETERS_METADATA, target, propertyKey) || []
    type = type || Reflect.getOwnMetadata(FUNCTION_RETURN_TYPE, target, propertyKey).name

    storage.addQueryField({
      name: propertyKey,
      type: type,
      resolver: target[propertyKey],
      parameters,
      options,
    })
  }
}
