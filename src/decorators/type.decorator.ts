import { storage } from '../utilities/storage'
import { TYPE_FIELDS_METADATA, OVERRIDE_NAME_METADATA } from '../constants'
import { TFieldDefinitionsMap, TCreateTypeOptions } from '../typings'

export function Type(nameOrOptions?: string | TCreateTypeOptions): ClassDecorator {
  return (constructorFn: any) => {
    const target = new constructorFn()

    const overridesType = Reflect.getMetadata(OVERRIDE_NAME_METADATA, constructorFn)
    const ownFields: TFieldDefinitionsMap = Reflect.getMetadata(TYPE_FIELDS_METADATA, target) || {}
    let inheritedFields: TFieldDefinitionsMap = {}

    if (!!constructorFn.__proto__.name) {
      const parent = new constructorFn.__proto__()
      inheritedFields = Reflect.getMetadata(TYPE_FIELDS_METADATA, parent) || {}
    }

    let name: string
    let interfaces: string[]

    if (nameOrOptions && typeof nameOrOptions === 'string') {
      name = nameOrOptions
      interfaces = []
    } else if (nameOrOptions && typeof nameOrOptions === 'object') {
      name = nameOrOptions.name || overridesType || constructorFn.name
      interfaces = nameOrOptions.interfaces?.map(i => i.name) || []
    } else {
      name = overridesType || constructorFn.name
      interfaces = []
    }

    storage.addTypeDefinition({
      name,
      fields: { ...inheritedFields, ...ownFields },
      interfaces,
    })
  }
}
