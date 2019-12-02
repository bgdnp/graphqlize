import { TFieldDefinitionsMap } from '../typings'
import { TYPE_FIELDS_METADATA } from '../constants'
import { storage } from '../utilities/storage'

export function Interface(): ClassDecorator {
  return (constructorFn: any) => {
    const name: string = constructorFn.name
    const fields: TFieldDefinitionsMap = Reflect.getMetadata(TYPE_FIELDS_METADATA, new constructorFn()) || {}

    storage.addInterfaceDefinition({ name, fields })
  }
}
