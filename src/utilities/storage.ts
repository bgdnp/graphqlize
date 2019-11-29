import { TQueryDefinition, TFieldDefinition, TDefinitions } from '../typings'

class MetaDataStorage {
  private query: TQueryDefinition = {
    name: 'Query',
    fields: {},
  }

  public addQueryField(field: TFieldDefinition): void {
    this.query.fields[field.name] = field
  }

  public getDefinitions(): TDefinitions {
    return {
      query: this.query,
    }
  }
}

export const storage = new MetaDataStorage()
