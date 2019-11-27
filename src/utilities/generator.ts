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
  GraphQLInterfaceType,
} from 'graphql'
import { storage } from '../metadata/storage'

export class Generator {
  private defaults

  private entities

  private types: { [name: string]: GraphQLObjectType } = {}
  private interfaces: { [name: string]: GraphQLInterfaceType } = {}

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
    const types: GraphQLObjectType[] = this.getTypes()

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

  private getTypes(): GraphQLObjectType[] {
    const types = {}

    for (let key in this.entities.interfaces) {
      if (!types[key]) {
        types[key] = this.getType(this.entities.interfaces[key])
      }
    }

    for (let key in this.entities.types) {
      if (!types[key]) {
        types[key] = this.getType(this.entities.types[key])
      }
    }

    return Object.values(types)
  }

  private getType(typeMeta, cleanType: boolean = false) {
    const typeName: string = typeMeta.type || typeMeta.name

    if (typeof typeMeta.nullable === 'undefined') {
      typeMeta.nullable = this.defaults.nullable
    }

    if (typeof typeMeta.nullableList === 'undefined') {
      typeMeta.nullableList = this.defaults.nullableList
    }

    if (this.scalars[typeName]) {
      return cleanType ? this.scalars[typeName] : this.configureType(this.scalars[typeName], typeMeta)
    }

    if (this.interfaces[typeName]) {
      return cleanType ? this.interfaces[typeName] : this.configureType(this.interfaces[typeName], typeMeta)
    }

    if (this.types[typeName]) {
      return cleanType ? this.types[typeName] : this.configureType(this.types[typeName], typeMeta)
    }

    return this.createType(typeMeta, cleanType)
  }

  private createType(meta, cleanType: boolean) {
    let typeName = meta.type || meta.name
    let fields = {}

    if (this.entities.types[typeName]) {
      for (let key in this.entities.types[typeName].fields) {
        fields[key] = { type: this.getType(this.entities.types[typeName].fields[key]) }
      }

      this.types[typeName] = new GraphQLObjectType({
        name: typeName,
        fields: () => fields,
        interfaces: () =>
          this.entities.types[typeName].interfaces?.map(item => {
            return this.getType(item, true)
          }),
      })

      return cleanType ? this.types[typeName] : this.configureType(this.types[typeName], meta)
    }

    if (this.entities.interfaces[typeName]) {
      for (let key in this.entities.interfaces[typeName].fields) {
        if (this.entities.interfaces[typeName].ownFields.indexOf(key) !== -1) {
          fields[key] = { type: this.getType(this.entities.interfaces[typeName].fields[key]) }
        }
      }

      this.interfaces[typeName] = new GraphQLInterfaceType({
        name: typeName,
        fields: () => fields,
      })

      return this.configureType(this.interfaces[typeName], meta)
    }
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
