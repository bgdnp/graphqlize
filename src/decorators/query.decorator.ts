import { storage } from '../utilities/storage'
import { FUNCTION_RETURN_TYPE, PARAMETERS_METADATA } from '../constants'
import { TParameter } from '../typings'

export function Query(): MethodDecorator {
  return (target: any, propertyKey: string) => {
    const type: string = Reflect.getOwnMetadata(FUNCTION_RETURN_TYPE, target, propertyKey).name
    const parameters: TParameter[] = Reflect.getOwnMetadata(PARAMETERS_METADATA, target, propertyKey) || []

    storage.addQueryField({
      name: propertyKey,
      type: type,
      resolver: target[propertyKey],
      parameters,
    })
  }
}
