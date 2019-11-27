import 'reflect-metadata'

type FieldOptions = {
  nullable: boolean
  nullableList?: boolean
  type?: Function | [Function]
}

// export function Field(): PropertyDecorator
export function Field(typeOrOptions?: Function | [Function] | FieldOptions): PropertyDecorator {
  let type: string
  let list: boolean
  let nullable: boolean
  let nullableList: boolean

  return (target: any, propertyKey: string) => {
    if (!typeOrOptions) {
      type = Reflect.getMetadata('design:type', target, propertyKey).name
      list = false
    }

    if (typeof typeOrOptions === 'function') {
      type = typeOrOptions.name
      list = false
    }

    if (Array.isArray(typeOrOptions)) {
      type = typeOrOptions[0].name
      list = true
    }

    if (typeof typeOrOptions === 'object' && !Array.isArray(typeOrOptions)) {
      if (!typeOrOptions.type) {
        type = Reflect.getMetadata('design:type', target, propertyKey).name
        list = false
      }

      if (typeof typeOrOptions.type === 'function') {
        type = typeOrOptions.type.name
        list = false
      }

      if (Array.isArray(typeOrOptions.type)) {
        type = typeOrOptions.type[0].name
        list = true
      }

      nullable = typeOrOptions.nullable
      nullableList = typeOrOptions.nullableList
    }

    const targetName: string = target.constructor.name

    if (!target.__fieldsMap) {
      target.__fieldsMap = {}
    }

    if (!target.__fieldsMap[targetName]) {
      target.__fieldsMap[targetName] = {}
    }

    target.__fieldsMap[targetName][propertyKey] = {
      type,
      list,
      nullable,
      nullableList,
    }
  }
}
