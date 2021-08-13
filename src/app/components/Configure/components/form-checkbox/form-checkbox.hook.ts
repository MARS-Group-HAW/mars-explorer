import { FieldInputProps, useField } from "formik";
import { namespaceToLabel } from "../../utils/namespaces";

type State = {
  label: string;
  checked: boolean;
  handleBlur: FieldInputProps<boolean>["onBlur"];
  handleChange: FieldInputProps<boolean>["onChange"];
};

function useFormCheckbox(name: string): State {
  const [{ value, onBlur, onChange }] = useField<boolean>(name);
  const label = namespaceToLabel(name);

  return {
    label,
    checked: value,
    handleBlur: onBlur,
    handleChange: onChange,
  };
}

export default useFormCheckbox;
