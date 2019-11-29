import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLScalarType,
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLNamedType,
  GraphQLField,
  GraphQLSchema,
} from 'graphql'
import { storage } from './storage'
import { TDefinitions, TFieldDefinition, TParameter } from '../typings'

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
      let args = {}

      this.definitions.query.fields[name].parameters?.map(param => {
        args[param.name] = {
          name: param.name,
          type: this.getType(param),
        }
      })

      fields[name] = {
        type: this.getType(this.definitions.query.fields[name]),
        args: args,
        resolve: (parent, parameters, context) => {
          const parsedParams = this.definitions.query.fields[name].parameters?.map(param => {
            if (param.kind === 'param') {
              return parameters[param.name]
            }
          })

          return this.definitions.query.fields[name].resolver(...parsedParams)
        },
      }
    }

    this.query = new GraphQLObjectType({
      name: this.definitions.query.name,
      fields: () => fields,
    })
  }

  private getType(field: TFieldDefinition | TParameter): GraphQLNamedType {
    if (this.scalars[field.type]) {
      return this.scalars[field.type]
    }

    if (this.types[field.type]) {
      return this.types[field.type]
    }
  }
}
