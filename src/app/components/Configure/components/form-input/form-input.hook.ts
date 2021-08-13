import { FieldInputProps, useField } from "formik";
import { namespaceToLabel } from "../../utils/namespaces";

type State = {
  value: string;
  fieldName: string;
  handleBlur: FieldInputProps<string>["onBlur"];
  handleChange: FieldInputProps<string>["onChange"];
  label: string;
  errorMessage: string;
  hasError: boolean;
};

type Props = { nameWithNamespace: string; disabled: boolean };

function useFormInput({ nameWithNamespace, disabled }: Props): State {
  const [{ value, name, onBlur, onChange }, { touched, error }] =
    useField<string>(nameWithNamespace);
  const label = namespaceToLabel(nameWithNamespace);
  const hasError = Boolean(touched && error && !disabled);

  return {
    value,
    fieldName: name,
    handleBlur: onBlur,
    handleChange: onChange,
    label,
    errorMessage: error || "",
    hasError,
  };
}

export default useFormInput;
