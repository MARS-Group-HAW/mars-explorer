import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import FormSwitch from "../form-switch";
import FormInput from "../form-input";
import FormBox from "../form-box/form-box";
import FormDatepicker from "../form-datepicker";
import useStyles from "./time-specification-form-styles";
import useTimeSpecificationForm from "./hooks";

const TimeSpecificationForm = ({ namespace }: { namespace: string }) => {
  const classes = useStyles();
  const {
    timeSpecNamespace,
    stepsNamespace,
    startPointNamespace,
    endPointNamespace,
    stepsMin,
    stepsDisabled,
    startPointMax,
    startPointDisabled,
    endPointMin,
    endPointDisabled,
    optionLeft,
    optionRight,
  } = useTimeSpecificationForm();

  return (
    <Grid
      container
      className={classes.timeSpecRoot}
      spacing={2}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item xs={12}>
        <FormSwitch
          name={timeSpecNamespace}
          optionLeft={optionLeft}
          optionRight={optionRight}
        />
      </Grid>
      <Grid item xs={3}>
        <FormInput
          name={stepsNamespace}
          type="number"
          disabled={stepsDisabled}
          InputProps={{ inputProps: { min: stepsMin } }}
        />
      </Grid>
      <Grid item xs={1}>
        <Typography variant="caption">OR</Typography>
      </Grid>
      <Grid xs={8} item className={classes.datesContainer}>
        <FormBox>
          <FormDatepicker
            name={startPointNamespace}
            disabled={startPointDisabled}
            InputProps={{
              inputProps: { max: startPointMax },
            }}
          />
        </FormBox>
        <FormBox>
          <FormDatepicker
            name={endPointNamespace}
            disabled={endPointDisabled}
            InputProps={{
              inputProps: { min: endPointMin },
            }}
          />
        </FormBox>
      </Grid>
    </Grid>
  );
};

export default TimeSpecificationForm;
