import { storage } from '../utilities/storage'
import { TYPE_FIELDS_METADATA } from '../constants'
import { TFieldDefinitionsMap, TCreateTypeOptions } from '../typings'

export function Type(nameOrOptions?: string | TCreateTypeOptions): ClassDecorator {
  return (constructorFn: any) => {
    const fields: TFieldDefinitionsMap = Reflect.getMetadata(TYPE_FIELDS_METADATA, new constructorFn()) || {}

    let name: string
    let interfaces: string[]

    if (nameOrOptions && typeof nameOrOptions === 'string') {
      name = nameOrOptions
      interfaces = []
    } else if (nameOrOptions && typeof nameOrOptions === 'object') {
      name = nameOrOptions.name || constructorFn.name
      interfaces = nameOrOptions.interfaces?.map(i => i.name) || []
    } else {
      name = constructorFn.name
      interfaces = []
    }

    storage.addTypeDefinition({ name, fields, interfaces })
  }
}
