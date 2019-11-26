import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLList } from 'graphql'
import { storage } from '../metadata/storage'

export class Generator {
  private defaults

  private entities

  private types: { [name: string]: GraphQLObjectType } = {}

  private scalars = {
    String: GraphQLString,
    Boolean: GraphQLBoolean,
  }

  constructor(defaults?) {
    this.defaults = defaults || {
      nullable: false,
      nullableList: false,
    }
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
      name: 'Query',
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
      let t = this.scalars[typeName]

      if (!typeMeta.nullable) {
        t = GraphQLNonNull(t)
      }

      if (typeMeta.list) {
        t = GraphQLList(t)

        if (!typeMeta.nullableList) {
          t = GraphQLNonNull(t)
        }
      }

      return t
    }

    if (this.types[typeName]) {
      let t: any = this.types[typeName]

      if (!typeMeta.nullable) {
        t = GraphQLNonNull(t)
      }

      if (typeMeta.list) {
        t = GraphQLList(t)

        if (!typeMeta.nullableList) {
          t = GraphQLNonNull(t)
        }
      }

      return t
    }

    let fields = {}

    for (let key in this.entities.types[typeName].fields) {
      fields[key] = { type: this.getType(this.entities.types[typeName].fields[key]) }
    }

    this.types[typeName] = new GraphQLObjectType({
      name: typeName,
      fields: () => fields,
    })

    let t: any = this.types[typeName]

    if (!typeMeta.nullable) {
      t = GraphQLNonNull(t)
    }

    if (typeMeta.list) {
      t = GraphQLList(t)

      if (!typeMeta.nullableList) {
        t = GraphQLNonNull(t)
      }
    }

    return t
  }
}
