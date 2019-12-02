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
} from 'graphql'
import { storage } from './storage'
import { TDefinitions, TFieldDefinition, TParameter, TTypeOptions } from '../typings'

export class Generator {
  private definitions: TDefinitions

  private query: GraphQLObjectType
  private scalars: { [name: string]: GraphQLScalarType } = {
    Boolean: GraphQLBoolean,
    Float: GraphQLFloat,
    ID: GraphQLID,
    Int: GraphQLInt,
    String: GraphQLString,
  }
  private types: { [name: string]: GraphQLNamedType } = {}
  private interfaces: { [name: string]: GraphQLNamedType } = {}

  createSchema() {
    this.definitions = storage.getDefinitions()

    this.createQuery()
    this.createTypes()

    return new GraphQLSchema({
      query: this.query,
      types: Object.values({
        ...this.types,
        ...this.interfaces,
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

  private createQueryArguments(fieldName: string) {
    return this.definitions.query.fields[fieldName].parameters?.reduce((argsObject, param) => {
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
      const parsedParams = this.definitions.query.fields[fieldName].parameters?.map(param => {
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

      return this.definitions.query.fields[fieldName].resolver(...parsedParams)
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

  private getType(field: TFieldDefinition | TParameter): GraphQLNullableType {
    let type: GraphQLNullableType

    if (this.scalars[field.type]) {
      type = this.scalars[field.type]
    }

    if (this.interfaces[field.type]) {
      type = this.interfaces[field.type]
    }

    if (this.types[field.type]) {
      type = this.types[field.type]
    }

    type = type || this.createObject(field.type)

    return this.processType(type, field.options)
  }

  private createObject(name: string): GraphQLNullableType {
    if (this.definitions.interfaces[name]) {
      return this.createInterface(name)
    }

    return this.createType(name)
  }

  private createInterface(interfaceName: string): GraphQLNullableType {
    const fieldsMap = this.definitions.interfaces[interfaceName].fields

    this.interfaces[interfaceName] = new GraphQLInterfaceType({
      name: interfaceName,
      fields: Object.values(fieldsMap).reduce((fields, field) => {
        fields[field.name] = {
          name: field.name,
          type: this.getType(field),
          resolve: field.resolver ? this.createFieldResolver(interfaceName, field.name) : undefined,
        }

        return fields
      }, {}),
    })

    return this.interfaces[interfaceName]
  }

  private createType(typeName: string): GraphQLNullableType {
    const fieldsMap = this.definitions.types[typeName].fields

    this.types[typeName] = new GraphQLObjectType({
      name: typeName,
      fields: Object.values(fieldsMap).reduce((fields, field) => {
        fields[field.name] = {
          name: field.name,
          type: this.getType(field),
          resolve: field.resolver ? this.createFieldResolver(typeName, field.name) : undefined,
        }

        return fields
      }, {}),
    })

    return this.types[typeName]
  }

  private processType(type: GraphQLNullableType, options: TTypeOptions): GraphQLNullableType {
    if (!options) {
      return type
    }

    let processedType: GraphQLNullableType

    if (options.isRequired) {
      processedType = GraphQLNonNull(type)
    }

    if (options.isList) {
      processedType = GraphQLList(processedType)

      if (options.isListRequired) {
        processedType = GraphQLNonNull(processedType)
      }
    }

    return processedType || type
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
  }
}
