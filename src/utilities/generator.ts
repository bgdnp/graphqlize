import { GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { storage } from '../metadata/storage'

export class Generator {
  private entities

  private types: { [name: string]: GraphQLObjectType } = {}

  private scalars = {
    String: GraphQLString,
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
      fields[key] = { type: this.getType(this.entities.query.fields[key].type) }
    }

    return new GraphQLObjectType({
      name: 'Query',
      fields: () => fields,
    })
  }

  private getType(typeName) {
    if (this.scalars[typeName]) {
      return this.scalars[typeName]
    }

    if (this.types[typeName]) {
      return this.types[typeName]
    }

    let fields = {}

    for (let key in this.entities.types[typeName].fields) {
      fields[key] = { type: this.getType(this.entities.types[typeName].fields[key].type) }
    }

    this.types[typeName] = new GraphQLObjectType({
      name: typeName,
      fields: () => fields,
    })

    return this.types[typeName]
  }
}
