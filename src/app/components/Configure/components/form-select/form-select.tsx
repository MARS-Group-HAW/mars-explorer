import * as React from "react";
import { MenuItem } from "@material-ui/core";
import FormInput, { FormInputProps } from "../form-input/form-input";
import useStyles from "./form-select-styles";

type Props = Omit<FormInputProps, "select"> & {
  options: { value: string; label: string }[];
};

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
