import { storage } from '../metadata/storage'

type TypeOptions = {
  name?: string
  interfaces?: Function[]
}

export function Type(options?: TypeOptions): ClassDecorator {
  return (constructorFn: any) => {
    storage.createTypeDefinition(constructorFn, options)
  }
}
