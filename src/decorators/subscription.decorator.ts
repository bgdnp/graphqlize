import { storage } from '../utilities/storage'
import { processQueryOptions } from '../helpers'
import { PARAMETERS_METADATA, FUNCTION_RETURN_TYPE } from '../constants'
import { TCreateQueryOptions, TParameter } from '../typings'

export function Subscription(typeOrOptions?: Function | [Function] | TCreateQueryOptions): MethodDecorator {
  let { type, options } = processQueryOptions(typeOrOptions)

  return (target: any, propertyKey: string) => {
    const parameters: TParameter[] = Reflect.getOwnMetadata(PARAMETERS_METADATA, target, propertyKey) || []
    type = type || Reflect.getOwnMetadata(FUNCTION_RETURN_TYPE, target, propertyKey).name

    storage.addSubscriptionField({
      name: propertyKey,
      type: type,
      resolver: target[propertyKey],
      parameters,
      options,
    })
  }
}
