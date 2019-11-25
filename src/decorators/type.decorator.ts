import { storage } from '../metadata/storage'

export function Type(): ClassDecorator {
  return (constructorFn: any) => {
    storage.createTypeDefinition(constructorFn)
  }
}
