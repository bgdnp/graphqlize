import { storage } from '../metadata/storage'

export function Interface(): ClassDecorator {
  return (constructorFn: any) => {
    storage.createInterfaceDefinition(constructorFn)
  }
}
