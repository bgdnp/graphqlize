import { storage } from '../utilities/storage'

export function Query(): MethodDecorator {
  return (target: any, propertyKey: string) => {
    const type = Reflect.getOwnMetadata('design:returntype', target, propertyKey).name

    storage.addQueryField({
      name: propertyKey,
      type: type,
      resolver: target[propertyKey],
    })
  }
}
