import * as React from "react";
import { Grid, Switch, Typography } from "@material-ui/core";
import { FormSwitchProps } from "./types";
import useFormSwitch from "./form-switch.hook";

const FormSwitch = ({ name, optionLeft, optionRight }: FormSwitchProps) => {
  const { value, checked, labelLeft, labelRight, handleBlur, handleChange } =
    useFormSwitch({ name, optionLeft, optionRight });

  return (
    <Typography component="div">
      <Grid
        component="label"
        container
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>{labelLeft}</Grid>
        <Grid item>
          <Switch
            id={name}
            name={name}
            value={value}
            onBlur={handleBlur}
            checked={checked}
            onChange={handleChange}
          />
        </Grid>
        <Grid item>{labelRight}</Grid>
      </Grid>
    </Typography>
  );
};

export default FormSwitch;
