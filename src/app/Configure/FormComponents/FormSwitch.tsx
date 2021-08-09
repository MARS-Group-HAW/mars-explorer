import * as React from "react";
import { Grid, Switch, Typography } from "@material-ui/core";
import { useField } from "formik";

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  optionLeft: Option;
  optionRight: Option;
};

const FormSwitch = ({ name, optionLeft, optionRight }: Props) => {
  const [field, , helper] = useField(name);

  const handleChange = (checked: boolean) => {
    helper.setValue(checked ? optionRight.value : optionLeft.value, false);
  };

  return (
    <Typography component="div">
      <Grid
        component="label"
        container
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Grid item>{optionLeft.label}</Grid>
        <Grid item>
          <Switch
            id={field.name}
            name={field.name}
            value={field.value}
            onBlur={field.onBlur}
            checked={field.value === optionRight.value}
            onChange={(_, checked) => handleChange(checked)}
          />
        </Grid>
        <Grid item>{optionRight.label}</Grid>
      </Grid>
    </Typography>
  );
};

export default FormSwitch;
