const withNamespace = (fieldName: string, namespace?: string): string =>
  namespace ? `${namespace}.${fieldName}` : fieldName;

export default withNamespace;
