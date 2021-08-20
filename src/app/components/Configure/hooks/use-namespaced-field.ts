import {
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
  useField,
} from "formik";
import withNamespace from "@app/components/Configure/utils/withNamespace";

type State<T> = [
  FieldInputProps<T>,
  FieldMetaProps<T>,
  FieldHelperProps<T>,
  string
];

function useNamespacedField<T>(field: string, namespace: string): State<T> {
  const fieldWithNamespace = withNamespace(field, namespace);
  return [...useField(fieldWithNamespace), fieldWithNamespace];
}

export default useNamespacedField;
