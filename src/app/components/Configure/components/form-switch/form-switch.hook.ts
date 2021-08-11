import { FieldInputProps, useField } from "formik";
import { ChangeEvent } from "react";
import { FormSwitchProps } from "./types";

type State = {
  value: string;
  checked: boolean;
  labelLeft: string;
  labelRight: string;
  handleBlur: FieldInputProps<string>["onBlur"];
  handleChange: (ev: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
};

type Props = FormSwitchProps;

function useFormSwitch({ name, optionLeft, optionRight }: Props): State {
  const [{ value, onBlur }, , { setValue }] = useField<string>(name);

  const handleChange = (_: ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setValue(checked ? optionRight.value : optionLeft.value, false);
  };

  return {
    value,
    checked: value === optionRight.value,
    labelLeft: optionLeft.label,
    labelRight: optionRight.label,
    handleBlur: onBlur,
    handleChange,
  };
}

export default useFormSwitch;
