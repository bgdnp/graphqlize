import { PARAMETERS_METADATA, FUNCTION_PARAM_TYPES } from '../constants'
import { TParameter, TParamOptions, TCreateParamOptions } from '../typings'

export function Param(name: string, paramOptions?: TCreateParamOptions): ParameterDecorator {
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

function processOptions(paramOptions: TCreateParamOptions): { type: string; options: TParamOptions } {
  let type: string
  let options: TParamOptions

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
