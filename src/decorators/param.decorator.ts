import { PARAMETERS_METADATA, FUNCTION_PARAM_TYPES } from '../constants'
import { TParameter, TParamOptions, TTypeOptions } from '../typings'

export function Param(name: string, paramOptions?: TParamOptions): ParameterDecorator {
  let { type, options } = processOptions(paramOptions)

  return (target: any, propertyKey: string, parameterIndex: number) => {
    type = type || Reflect.getOwnMetadata(FUNCTION_PARAM_TYPES, target, propertyKey)[parameterIndex].name
    options = options || {
      isRequired: true,
      isList: false,
      isListRequired: false,
    }

    const metadata: TParameter[] = Reflect.getOwnMetadata(PARAMETERS_METADATA, target, propertyKey) || []

    metadata.unshift({
      kind: 'param',
      name,
      index: parameterIndex,
      type,
      options,
    })

    Reflect.defineMetadata(PARAMETERS_METADATA, metadata, target, propertyKey)
  }
}

function processOptions(paramOptions: TParamOptions): { type: string; options: TTypeOptions } {
  let type: string
  let options: TTypeOptions

  if (paramOptions) {
    if (typeof paramOptions.type === 'function') {
      type = paramOptions.type.name
      options = {
        isRequired: !(paramOptions.nullable || false),
        isList: false,
        isListRequired: false,
      }
    } else if (Array.isArray(paramOptions.type)) {
      type = paramOptions.type[0].name
      options = {
        isRequired: !(paramOptions.nullable || false),
        isList: true,
        isListRequired: !(paramOptions.nullableList || false),
      }
    }
  }

  return { type, options }
}
