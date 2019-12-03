import { TCreateQueryOptions, TTypeOptions, TFieldOptions } from '../typings'

export function processQueryOptions(
  typeOrOptions: Function | [Function] | TCreateQueryOptions,
): { type?: string; options: TTypeOptions & TFieldOptions } {
  let type: string
  let options: TTypeOptions

  if (typeof typeOrOptions === 'function') {
    type = typeOrOptions.name
    options = {
      isRequired: true,
      isList: false,
      isListRequired: false,
    }
  } else if (Array.isArray(typeOrOptions)) {
    type = typeOrOptions[0].name
    options = {
      isRequired: true,
      isList: true,
      isListRequired: true,
    }
  } else if (typeof typeOrOptions === 'object') {
    if (typeof typeOrOptions.type === 'function') {
      type = typeOrOptions.type.name
      options = {
        isRequired: !typeOrOptions.nullable,
        isList: false,
        isListRequired: false,
      }
    } else if (Array.isArray(typeOrOptions.type)) {
      type = typeOrOptions.type[0].name
      options = {
        isRequired: !typeOrOptions.nullable,
        isList: true,
        isListRequired: !typeOrOptions.nullableList,
      }
    } else {
      options = {
        isRequired: !typeOrOptions.nullable,
        isList: false,
        isListRequired: false,
      }
    }
  } else {
    options = {
      isRequired: true,
      isList: false,
      isListRequired: false,
    }
  }

  return { type, options }
}
