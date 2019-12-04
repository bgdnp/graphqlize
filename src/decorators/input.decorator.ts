import { TFieldDefinitionsMap } from '../typings'
import { TYPE_FIELDS_METADATA } from '../constants'
import { storage } from '../utilities/storage'

export function Input(name?: string): ClassDecorator {
  return (constructorFn: any) => {
    const fields: TFieldDefinitionsMap = Reflect.getMetadata(TYPE_FIELDS_METADATA, new constructorFn()) || {}

    name = name || constructorFn.name

    storage.addInputDefinition({ name, fields })
  }
}
