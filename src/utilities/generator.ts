import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLList,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
} from 'graphql'
import { storage } from '../metadata/storage'

export class Generator {
  private defaults

  private entities

  private types: { [name: string]: GraphQLObjectType } = {}

  private scalars = {
    Boolean: GraphQLBoolean,
    Float: GraphQLFloat,
    ID: GraphQLID,
    Int: GraphQLInt,
    String: GraphQLString,
  }

  constructor(defaults?) {
    let predefined = {
      nullable: false,
      nullableList: false,
      rootQueryTypeName: 'Query',
    }

    this.defaults = { ...predefined, ...defaults }
  }

  public createSchema() {
    this.entities = storage.getEntities()

    const query = this.getQuery()
    const types = Object.values(this.types)

    return new GraphQLSchema({
      query,
      types,
    })
  }

  private getQuery() {
    let fields = {}

    for (let key in this.entities.query.fields) {
      fields[key] = { type: this.getType(this.entities.query.fields[key]) }
    }

    return new GraphQLObjectType({
      name: this.defaults.rootQueryTypeName,
      fields: () => fields,
    })
  }

  private getType(typeMeta) {
    const typeName: string = typeMeta.type

    if (typeof typeMeta.nullable === 'undefined') {
      typeMeta.nullable = this.defaults.nullable
    }

    if (typeof typeMeta.nullableList === 'undefined') {
      typeMeta.nullableList = this.defaults.nullableList
    }

    if (this.scalars[typeName]) {
      return this.configureType(this.scalars[typeName], typeMeta)
    }

    if (this.types[typeName]) {
      return this.configureType(this.types[typeName], typeMeta)
    }

    let fields = {}

    for (let key in this.entities.types[typeName].fields) {
      fields[key] = { type: this.getType(this.entities.types[typeName].fields[key]) }
    }

    this.types[typeName] = new GraphQLObjectType({
      name: typeName,
      fields: () => fields,
    })

    return this.configureType(this.types[typeName], typeMeta)
  }

  private configureType(type, meta) {
    if (!meta.nullable) {
      type = GraphQLNonNull(type)
    }

    if (meta.list) {
      type = GraphQLList(type)

      if (!meta.nullableList) {
        type = GraphQLNonNull(type)
      }
    }

    return type
  }
}
