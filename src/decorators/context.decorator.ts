import { TParameter } from '../typings'
import { PARAMETERS_METADATA } from '../constants'

export function Context(): ParameterDecorator {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const metadata: TParameter[] = Reflect.getOwnMetadata(PARAMETERS_METADATA, target, propertyKey) || []

    metadata.unshift({
      kind: 'context',
      index: parameterIndex,
    })

    Reflect.defineMetadata(PARAMETERS_METADATA, metadata, target, propertyKey)
  }
}
