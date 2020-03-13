import { storage } from '../utilities/storage'

export function Scalar(): ClassDecorator {
  return (constructorFn: any) => {
    const instance = new constructorFn()

    storage.addScalarDefinition({
      name: constructorFn.name,
      serialize: instance.serialize.bind(instance),
      parseValue: instance.parseValue?.bind(instance) || instance.serialize.bind(instance),
      parseLiteral: instance.parseLiteral?.bind(instance),
    })
  }
}
