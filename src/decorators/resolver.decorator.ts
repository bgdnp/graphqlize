import { FIELD_RESOLVERS_METADATA } from '../constants'
import { storage } from '../utilities/storage'

export function Resolver(type: Function): ClassDecorator {
  return (constructorFn: any) => {
    const fieldResolvers = Reflect.getMetadata(FIELD_RESOLVERS_METADATA, new constructorFn()) || {}

    storage.addFieldResolvers(fieldResolvers, type.name)
  }
}
