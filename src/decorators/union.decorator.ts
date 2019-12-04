import { TParameter, TCreateUnionOptions } from '../typings'
import { RESOLVE_TYPE_METADATA } from '../constants'
import { storage } from '../utilities/storage'

export function Union(options: TCreateUnionOptions): ClassDecorator {
  return (constructorFn: any) => {
    const name: string = options.name || constructorFn.name
    const types: Function[] = options.types
    const instance: any = new constructorFn()

    const { resolver, parameters }: { resolver: Function; parameters: TParameter[] } = Reflect.getMetadata(
      RESOLVE_TYPE_METADATA,
      instance,
    ) || { resolver: undefined, parameters: undefined }

    storage.addUnionDefinition({ name, types, resolver, parameters })
  }
}
