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
  private types: { [name: string]: GraphQLObjectType } = {}

  createSchema() {
    this.definitions = storage.getDefinitions()

    this.createQuery()

    return new GraphQLSchema({
      query: this.query,
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

    if (this.types[field.type]) {
      type = this.types[field.type]
    }

    type = type || this.createType(field.type)

    return this.processType(type, field.options)
  }

  private createType(typeName: string): GraphQLNullableType {
    console.log(typeName)
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
}
