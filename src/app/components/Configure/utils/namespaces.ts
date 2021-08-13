export type WithNamespace = {
  name: string;
};

export function namespaceToLabel(namespace: string): string {
  return namespace.split(".").pop();
}
