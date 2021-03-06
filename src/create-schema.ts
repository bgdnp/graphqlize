import { GraphQLSchema, printSchema } from 'graphql'
import { join } from 'path'
import { writeFile } from 'fs'
import { Generator } from './utilities/generator'
import { TCreateSchemaOptions } from './typings'

export function createSchema(options: TCreateSchemaOptions): GraphQLSchema {
  const generator = new Generator()

  const schema: GraphQLSchema = generator.createSchema()

  if (options.schemaFile) {
    const path: string = join(process.cwd(), options.schemaFile)
    const data: string = '# AUTO GENERATED BY @bgdn/graphqlize\n\n' + printSchema(schema)

    writeFile(path, data, () => {})
  }

  return schema
}
