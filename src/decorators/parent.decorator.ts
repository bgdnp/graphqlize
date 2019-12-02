import { TParameter } from '../typings'
import { PARAMETERS_METADATA } from '../constants'

export function Parent(): ParameterDecorator {
  return (target: any, propertyKey: string, parameterIndex: number) => {
    const metadata: TParameter[] = Reflect.getOwnMetadata(PARAMETERS_METADATA, target, propertyKey) || []

    metadata.unshift({
      kind: 'parent',
      index: parameterIndex,
    })

    Reflect.defineMetadata(PARAMETERS_METADATA, metadata, target, propertyKey)
  }
}
