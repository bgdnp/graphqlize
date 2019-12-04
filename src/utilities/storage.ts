import {
  TQueryDefinition,
  TFieldDefinition,
  TDefinitions,
  TTypeDefinitionsMap,
  TTypeDefinition,
  TInterfaceDefinitionsMap,
  TInterfaceDefinition,
} from '../typings'
import { TUnionDefinitionsMap, TUnionDefinition } from '../typings/union'

class MetaDataStorage {
  private query: TQueryDefinition = {
    name: 'Query',
    fields: {},
  }

  private types: TTypeDefinitionsMap = {}
  private interfaces: TInterfaceDefinitionsMap = {}
  private unions: TUnionDefinitionsMap = {}

  public addQueryField(field: TFieldDefinition): void {
    this.query.fields[field.name] = field
  }

  public addTypeDefinition(typeDefinition: TTypeDefinition): void {
    this.types[typeDefinition.name] = typeDefinition
  }

  public addInterfaceDefinition(interfaceDefinition: TInterfaceDefinition): void {
    this.interfaces[interfaceDefinition.name] = interfaceDefinition
  }

  public addUnionDefinition(unionDefinition: TUnionDefinition): void {
    this.unions[unionDefinition.name] = unionDefinition
  }

  public addFieldResolvers(fieldResolvers: { [fieldName: string]: Function }, typeName: string): void {
    const fieldNames = Object.keys(fieldResolvers)

    fieldNames.forEach(fieldName => {
      this.types[typeName].fields[fieldName].resolver = fieldResolvers[fieldName]
    })
  }

  public getDefinitions(): TDefinitions {
    return {
      query: this.query,
      types: this.types,
      interfaces: this.interfaces,
      unions: this.unions,
    }
  }
}

export const storage = new MetaDataStorage()
