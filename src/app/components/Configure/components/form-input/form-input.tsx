import * as React from "react";
import {
  StandardTextFieldProps,
  TextField,
  Tooltip,
  withStyles,
} from "@material-ui/core";
import useFormInput from "./form-input.hook";

export type FormInputProps = { name: string } & Omit<
  StandardTextFieldProps,
  "fullWidth" | "id" | "value" | "onBlur" | "onChange" | "error" | "helperText"
>;

const ErrorTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}))(Tooltip);

const FormInput = ({ name, children, ...rest }: FormInputProps) => {
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
        label={label}
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
