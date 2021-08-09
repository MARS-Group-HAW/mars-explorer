import * as React from "react";
import { useField } from "formik";
import {
  StandardTextFieldProps,
  TextField,
  Tooltip,
  withStyles,
} from "@material-ui/core";

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
  const [field, meta] = useField(name);
  const label = name.split(".").pop(); // remove namespace
  const hasError = Boolean(meta.touched && meta.error && !rest.disabled);
  return (
    <ErrorTooltip open={hasError} title={meta.error || ""}>
      <TextField
        size="small"
        fullWidth
        id={field.name}
        name={field.name}
        label={label}
        value={field.value || ""}
        onBlur={field.onBlur}
        onChange={field.onChange}
        error={hasError}
        {...rest}
      >
        {children}
      </TextField>
    </ErrorTooltip>
  );
};

export default FormInput;
