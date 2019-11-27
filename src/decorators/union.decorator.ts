import { storage } from '../metadata/storage'

type TUnionOptions = {
  name?: string
  types: Function[]
}

export function Union(options: TUnionOptions): ClassDecorator {
  return (constructorFn: any) => {
    storage.createUnionDefinition(constructorFn, options)
  }
}
