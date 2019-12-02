import { TQueryDefinition, TFieldDefinition, TDefinitions, TTypeDefinitionsMap, TTypeDefinition } from '../typings'

class MetaDataStorage {
  private query: TQueryDefinition = {
    name: 'Query',
    fields: {},
  }

  private types: TTypeDefinitionsMap = {}

  public addQueryField(field: TFieldDefinition): void {
    this.query.fields[field.name] = field
  }

  public addTypeDefinition(typeDefinition: TTypeDefinition): void {
    this.types[typeDefinition.name] = typeDefinition
  }

  public getDefinitions(): TDefinitions {
    return {
      query: this.query,
      types: this.types,
    }
  }
}

export const storage = new MetaDataStorage()