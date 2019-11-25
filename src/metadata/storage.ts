type TFieldDefinition = {
  type: string | [string]
}

type TFieldDefinitionsMap = {
  [fieldName: string]: TFieldDefinition
}

type TTypeDefinition = {
  name: string
  fields: TFieldDefinitionsMap
}

type TTypeDefinitionsMap = {
  [typeName: string]: TTypeDefinition
}

class MetaStorage {
  private query: TTypeDefinition = {
    name: 'Query',
    fields: {},
  }

  private types: TTypeDefinitionsMap = {}

  public addQueryDefinition(name: string, type: string) {
    this.query.fields[name] = {
      type,
    }
  }

  public createTypeDefinition(constructorFn: any) {
    const name: string = constructorFn.name

    const { __fieldsMap } = new constructorFn()

    this.types[name] = {
      name,
      fields: __fieldsMap,
    }
  }

  public getEntities() {
    return {
      query: this.query,
      types: this.types,
    }
  }
}

export const storage = new MetaStorage()
