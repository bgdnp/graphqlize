import { FIELD_RESOLVERS_METADATA } from '../constants'

export function FieldResolver(fieldName?: string): MethodDecorator {
  return (target: any, name: string) => {
    fieldName = fieldName || name

    const fieldResolvers = Reflect.getOwnMetadata(FIELD_RESOLVERS_METADATA, target) || {}

    fieldResolvers[fieldName] = target[name].bind(target)

    Reflect.defineMetadata(FIELD_RESOLVERS_METADATA, fieldResolvers, target)
  }
}
