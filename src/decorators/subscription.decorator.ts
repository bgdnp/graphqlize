import { storage } from '../utilities/storage'
import { processQueryOptions } from '../helpers'
import { PARAMETERS_METADATA } from '../constants'
import { TCreateQueryOptions, TParameter } from '../typings'

export function Subscription(typeOrOptions: Function | [Function] | Required<TCreateQueryOptions>): MethodDecorator {
  let { type, options } = processQueryOptions(typeOrOptions)

  return (target: any, propertyKey: string) => {
    const parameters: TParameter[] = Reflect.getOwnMetadata(PARAMETERS_METADATA, target, propertyKey) || []

    storage.addSubscriptionField({
      name: propertyKey,
      type: type,
      resolver: target[propertyKey].bind(target),
      parameters,
      options,
    })
  }
}
