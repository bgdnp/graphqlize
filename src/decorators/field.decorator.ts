export function Field(): PropertyDecorator {
  return (target: any, propertyKey: string) => {
    if (!target.__fieldsMap) {
      target.__fieldsMap = {}
    }

    target.__fieldsMap[propertyKey] = {
      type: 'String',
    }
  }
}
