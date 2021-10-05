import * as React from "react";
import { TextField, Tooltip, withStyles } from "@material-ui/core";
import { TextFieldProps } from "@material-ui/core/TextField/TextField";
import useFormInput from "./form-input.hook";

export type FormInputProps = { name: string; outlined?: boolean } & Omit<
  TextFieldProps,
  | "fullWidth"
  | "id"
  | "value"
  | "onBlur"
  | "onChange"
  | "error"
  | "helperText"
  | "variant"
>;

const ErrorTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}))(Tooltip);

const FormInput = ({
  name,
  children,
  placeholder,
  outlined = false,
  ...rest
}: FormInputProps) => {
  const {
    fieldName,
    value,
    label,
    errorMessage,
    hasError,
    handleBlur,
    handleChange,
  } = useFormInput({ nameWithNamespace: name, disabled: rest.disabled });

  return (
    <ErrorTooltip open={hasError} title={errorMessage}>
      <TextField
        size="small"
        fullWidth
        id={fieldName}
        name={fieldName}
        variant={outlined ? "outlined" : "standard"}
        label={placeholder ? null : label}
        placeholder={placeholder}
        value={value || ""}
        onBlur={handleBlur}
        onChange={handleChange}
        error={hasError}
        {...rest}
      >
        {children}
      </TextField>
    </ErrorTooltip>
  );
};

export default FormInput;
