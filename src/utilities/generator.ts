import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLScalarType,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLNamedType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLNullableType,
  GraphQLList,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLInputObjectType,
} from 'graphql'
import { storage } from './storage'
import { TDefinitions, TFieldDefinition, TParameter, TTypeOptions } from '../typings'

export class Generator {
  private definitions: TDefinitions
  private inBuildingProcess: { [name: string]: string } = {}

  private query: GraphQLObjectType
  private mutation: GraphQLObjectType
  private scalars: { [name: string]: GraphQLScalarType } = {
    Boolean: GraphQLBoolean,
    Float: GraphQLFloat,
    ID: GraphQLID,
    Int: GraphQLInt,
    String: GraphQLString,
  }
  private types: { [name: string]: GraphQLNamedType } = {}
  private interfaces: { [name: string]: GraphQLNamedType } = {}
  private unions: { [name: string]: GraphQLNamedType } = {}
  private inputs: { [name: string]: GraphQLNamedType } = {}

  createSchema() {
    this.definitions = storage.getDefinitions()

    this.createQuery()
    this.createMutation()
    this.createTypes()

    return new GraphQLSchema({
      query: this.query,
      mutation: this.mutation,
      types: Object.values({
        ...this.types,
        ...this.interfaces,
        ...this.unions,
      }),
    })
  }

  private createQuery() {
    const fields: any = {}

    for (let name in this.definitions.query.fields) {
      fields[name] = {
        type: this.getType(this.definitions.query.fields[name]),
        args: this.createQueryArguments(name),
        resolve: this.createQueryResolver(name),
      }
    }

    this.query = new GraphQLObjectType({
      name: this.definitions.query.name,
      fields: () => fields,
    })
  }

  private createMutation(): GraphQLObjectType {
    if (Object.keys(this.definitions.mutation.fields).length === 0) {
      return
    }

    const fields: any = {}

    for (let name in this.definitions.mutation.fields) {
      fields[name] = {
        type: this.getType(this.definitions.mutation.fields[name]),
        args: this.createQueryArguments(name),
        resolve: this.createQueryResolver(name),
      }
    }

    this.mutation = new GraphQLObjectType({
      name: this.definitions.mutation.name,
      fields: () => fields,
    })
  }

  private createQueryArguments(fieldName: string) {
    const definition = this.definitions.query.fields[fieldName] || this.definitions.mutation.fields[fieldName]

    return definition.parameters?.reduce((argsObject, param) => {
      if (param.kind === 'param') {
        argsObject[param.name] = {
          name: param.name,
          type: this.getType(param),
        }
      }

      return argsObject
    }, {})
  }

  private createQueryResolver(fieldName: string) {
    return (parent, parameters, context, info) => {
      const definition = this.definitions.query.fields[fieldName] || this.definitions.mutation.fields[fieldName]

      const parsedParams = definition.parameters?.map(param => {
        switch (param.kind) {
          case 'param':
            return parameters[param.name]
          case 'parent':
            return parent
          case 'context':
            return context
          case 'info':
            return info
          default:
            return undefined
        }
      })

      return definition.resolver(...parsedParams)
    }
  }

  private createFieldResolver(typeName: string, fieldName: string) {
    return (parent, parameters, context, info) => {
      const parsedParams =
        this.definitions.types[typeName].fields[fieldName].parameters?.map(param => {
          switch (param.kind) {
            case 'param':
              return parameters[param.name]
            case 'parent':
              return parent
            case 'context':
              return context
            case 'info':
              return info
            default:
              return undefined
          }
        }) || []

      return this.definitions.types[typeName].fields[fieldName].resolver(...parsedParams)
    }
  }

  private createTypeResolver(typeName: string) {
    return (parent, parameters, context, info) => {
      const definition = this.definitions.interfaces[typeName] || this.definitions.unions[typeName]

      const parsedParams =
        definition.parameters?.map(param => {
          switch (param.kind) {
            case 'param':
              return parameters[param.name]
            case 'parent':
              return parent
            case 'context':
              return context
            case 'info':
              return info
            default:
              return undefined
          }
        }) || []

      const resolvedTypeName: string = definition.resolver(...parsedParams).name

      return this.getType({
        name: resolvedTypeName,
        type: resolvedTypeName,
      }) as GraphQLObjectType
    }
  }

  private getType(field: TFieldDefinition | TParameter): GraphQLNullableType {
    if (this.inBuildingProcess[field.type]) {
      return
    }

    const type: GraphQLNullableType =
      this.scalars[field.type] ??
      this.interfaces[field.type] ??
      this.unions[field.type] ??
      this.inputs[field.type] ??
      this.types[field.type] ??
      this.createObject(field.type)

    return this.processType(type, field.options)
  }

  private createObject(name: string): GraphQLNullableType {
    if (this.definitions.interfaces[name]) {
      return this.createInterface(name)
    }

    if (this.definitions.unions[name]) {
      return this.createUnion(name)
    }

    if (this.definitions.inputs[name]) {
      return this.createInput(name)
    }

    return this.createType(name)
  }

  private createInterface(interfaceName: string): GraphQLNullableType {
    this.inBuildingProcess[interfaceName] = 'interfaces'

    const fieldsMap = this.definitions.interfaces[interfaceName].fields

    this.interfaces[interfaceName] = new GraphQLInterfaceType({
      name: interfaceName,
      fields: () =>
        Object.values(fieldsMap).reduce((fields, field) => {
          fields[field.name] = {
            name: field.name,
            type:
              this.getType(field) ||
              this.processType(this[this.inBuildingProcess[field.type]][field.type], field.options),
            resolve: field.resolver ? this.createFieldResolver(interfaceName, field.name) : undefined,
          }

          return fields
        }, {}),
      resolveType: this.createTypeResolver(interfaceName),
    })

    delete this.inBuildingProcess[interfaceName]

    return this.interfaces[interfaceName]
  }

  private createUnion(unionName: string): GraphQLNullableType {
    this.inBuildingProcess[unionName] = 'unions'

    this.unions[unionName] = new GraphQLUnionType({
      name: unionName,
      types: () =>
        this.definitions.unions[unionName].types.map(type => {
          return (
            (this.getType({
              name: type.name,
              type: type.name,
            }) as GraphQLObjectType) || this[this.inBuildingProcess[type.name]][type.name]
          )
        }),
      resolveType: this.createTypeResolver(unionName),
    })

    delete this.inBuildingProcess[unionName]

    return this.unions[unionName]
  }

  private createType(typeName: string): GraphQLNullableType {
    this.inBuildingProcess[typeName] = 'types'

    let inheritedFields = {}

    const interfaces = () =>
      this.definitions.types[typeName].interfaces.map(interfaceName => {
        const interfaceType = this.getType({
          name: interfaceName,
          type: interfaceName,
        }) as GraphQLInterfaceType

        inheritedFields = Object.values(interfaceType.getFields()).reduce((fields, field) => {
          fields[field.name] = {
            name: field.name,
            type: field.type,
          }

          return fields
        }, inheritedFields)

        return interfaceType
      })

    const fields = () =>
      Object.values(this.definitions.types[typeName].fields).reduce((fields, field) => {
        fields[field.name] = {
          name: field.name,
          type:
            this.getType(field) ||
            this.processType(this[this.inBuildingProcess[field.type]][field.type], field.options),
          resolve: field.resolver ? this.createFieldResolver(typeName, field.name) : undefined,
        }

        return fields
      }, inheritedFields)

    this.types[typeName] = new GraphQLObjectType({
      name: typeName,
      fields,
      interfaces,
    })

    delete this.inBuildingProcess[typeName]

    return this.types[typeName]
  }

  private createInput(inputName: string): GraphQLNullableType {
    const fields = Object.values(this.definitions.inputs[inputName].fields).reduce((fields, field) => {
      fields[field.name] = {
        name: field.name,
        type: this.getType(field),
      }

      return fields
    }, {})

    this.inputs[inputName] = new GraphQLInputObjectType({
      name: inputName,
      fields,
    })

    return this.inputs[inputName]
  }

  private processType(type: GraphQLNullableType, options: TTypeOptions): GraphQLNullableType {
    if (!options) {
      return type
    }

    let processedType: GraphQLNullableType = options.isRequired ? GraphQLNonNull(type) : type
    processedType = options.isList ? GraphQLList(processedType) : processedType
    processedType = options.isList && options.isListRequired ? GraphQLNonNull(processedType) : processedType

    return processedType
  }

  private createTypes() {
    for (let key in this.definitions.types) {
      if (!this.types[key]) {
        this.createType(key)
      }
    }

    for (let key in this.definitions.interfaces) {
      if (!this.interfaces[key]) {
        this.createInterface(key)
      }
    }

    for (let key in this.definitions.unions) {
      if (!this.unions[key]) {
        this.createUnion(key)
      }
    }
  }
}
