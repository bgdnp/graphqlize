import { PARAMETERS_METADATA, FUNCTION_PARAM_TYPES } from '../constants'
import { TParameter } from '../typings'

export function Param(name: string): ParameterDecorator {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const type: string = Reflect.getOwnMetadata(FUNCTION_PARAM_TYPES, target, propertyKey)[parameterIndex].name
    const metadata: TParameter[] = Reflect.getOwnMetadata(PARAMETERS_METADATA, target, propertyKey) || []

    metadata.unshift({
      kind: 'param',
      name,
      index: parameterIndex,
      type,
    })

    Reflect.defineMetadata(PARAMETERS_METADATA, metadata, target, propertyKey)
  }
}
