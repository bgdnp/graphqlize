import { OVERRIDE_NAME_METADATA } from '../constants'

export function Overrides(type: Function): ClassDecorator {
  return (constructorFn: any) => {
    Reflect.defineMetadata(OVERRIDE_NAME_METADATA, type.name, constructorFn)
  }
}
