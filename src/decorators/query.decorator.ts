import { storage } from '../metadata/storage'

export function Query(type: Function | [Function]): MethodDecorator {
  let returnType

  if (typeof type === 'function') {
    returnType = type.name
  } else {
    returnType = type[0].name
  }

  return (target: any, propertyKey: string) => {
    storage.addQueryDefinition(propertyKey, returnType)
  }
}
