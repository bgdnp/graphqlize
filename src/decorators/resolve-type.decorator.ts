import { RESOLVE_TYPE_METADATA, PARAMETERS_METADATA } from '../constants'
import { TParameter } from '../typings'

export function ResolveType(): MethodDecorator {
  return (target: any, name: string) => {
    const parameters: TParameter[] = Reflect.getOwnMetadata(PARAMETERS_METADATA, target, name)

    const metadata = {
      resolver: target[name],
      parameters,
    }

    Reflect.defineMetadata(RESOLVE_TYPE_METADATA, metadata, target)
  }
}
