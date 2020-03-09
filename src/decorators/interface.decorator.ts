import { TFieldDefinitionsMap, TParameter } from '../typings'
import { TYPE_FIELDS_METADATA, RESOLVE_TYPE_METADATA, OVERRIDE_NAME_METADATA } from '../constants'
import { storage } from '../utilities/storage'

export function Interface(): ClassDecorator {
  return (constructorFn: any) => {
    const name: string = Reflect.getMetadata(OVERRIDE_NAME_METADATA, constructorFn) || constructorFn.name
    const instance: any = new constructorFn()
    const fields: TFieldDefinitionsMap = Reflect.getMetadata(TYPE_FIELDS_METADATA, instance) || {}

    const { resolver, parameters }: { resolver: Function; parameters: TParameter[] } = Reflect.getMetadata(
      RESOLVE_TYPE_METADATA,
      instance,
    ) || { resolver: undefined, parameters: undefined }

    storage.addInterfaceDefinition({ name, fields, resolver, parameters })
  }
}
