import * as React from "react";
import { MenuItem } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FormInput, { FormInputProps } from "./FormInput";

type Props = Omit<FormInputProps, "select"> & {
  options: { value: string; label: string }[];
};

const useStyles = makeStyles(() => ({
  input: {
    textAlign: "left",
  },
}));

const FormDatepicker = ({ options, ...rest }: Props) => {
  const classes = useStyles();

  return (
    <FormInput select {...rest} className={classes.input}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </FormInput>
  );
};

export default FormDatepicker;
