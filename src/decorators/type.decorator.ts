import { storage } from '../utilities/storage'
import { TYPE_FIELDS_METADATA } from '../constants'
import { TFieldDefinitionsMap } from '../typings'

export function Type(): ClassDecorator {
  return (constructorFn: any) => {
    const name: string = constructorFn.name
    const fields: TFieldDefinitionsMap = Reflect.getMetadata(TYPE_FIELDS_METADATA, new constructorFn()) || {}

    storage.addTypeDefinition({ name, fields })
  }
}
