import {
  TQueryDefinition,
  TFieldDefinition,
  TDefinitions,
  TTypeDefinitionsMap,
  TTypeDefinition,
  TInterfaceDefinitionsMap,
  TInterfaceDefinition,
  TInputDefinition,
  TInputDefinitionsMap,
  TUnionDefinitionsMap,
  TUnionDefinition,
  TScalarDefinitionsMap,
  TScalarDefinition,
} from '../typings'

class MetaDataStorage {
  private query: TQueryDefinition = {
    name: 'Query',
    fields: {},
  }
  private mutation: TQueryDefinition = {
    name: 'Mutation',
    fields: {},
  }
  private subscription: TQueryDefinition = {
    name: 'Subscription',
    fields: {},
  }

  private types: TTypeDefinitionsMap = {}
  private interfaces: TInterfaceDefinitionsMap = {}
  private unions: TUnionDefinitionsMap = {}
  private inputs: TInputDefinitionsMap = {}
  private scalars: TScalarDefinitionsMap = {}

  public addQueryField(field: TFieldDefinition): void {
    this.query.fields[field.name] = field
  }

  public addMutationField(field: TFieldDefinition): void {
    this.mutation.fields[field.name] = field
  }

  public addSubscriptionField(field: TFieldDefinition): void {
    this.subscription.fields[field.name] = field
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

  public addInputDefinition(inputDefinition: TInputDefinition): void {
    this.inputs[inputDefinition.name] = inputDefinition
  }

  public addScalarDefinition(scalarDefinition: TScalarDefinition): void {
    this.scalars[scalarDefinition.name] = scalarDefinition
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
      mutation: this.mutation,
      subscription: this.subscription,
      types: this.types,
      interfaces: this.interfaces,
      unions: this.unions,
      inputs: this.inputs,
      scalars: this.scalars,
    }
  }
}

export const storage = new MetaDataStorage()
