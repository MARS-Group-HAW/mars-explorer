import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useField } from "formik";
import { useEffect } from "react";
import FormSwitch from "../FormComponents/FormSwitch";
import withNamespace from "../withNamespace";
import FieldNames from "./fieldNames";
import TimeSpecification from "./types";
import FormInput from "../FormComponents/FormInput";
import PaddedBox from "../FormComponents/PaddedBox";
import FormDatepicker from "../FormComponents/FormDatepicker";
import defaultValues from "./defaultValues";

const useStyles = makeStyles((theme) => ({
  timeSpecRoot: {
    padding: theme.spacing(2),
  },
  datesContainer: {
    padding: theme.spacing(3),
  },
}));

const TimeSpecificationForm = ({ namespace }: { namespace: string }) => {
  const classes = useStyles();

  const timeSpecNamespace = withNamespace(
    FieldNames.TIME_SPECIFICATION,
    namespace
  );
  const stepsNamespace = withNamespace(FieldNames.STEPS, namespace);
  const startPointNamespace = withNamespace(FieldNames.START_POINT, namespace);
  const endPointNamespace = withNamespace(FieldNames.END_POINT, namespace);

  const [timeSpecField] = useField(timeSpecNamespace);
  const [, , stepsHelpers] = useField(stepsNamespace);
  const [startPointField, , startPointHelpers] = useField(startPointNamespace);
  const [endPointField, , endPointHelpers] = useField(endPointNamespace);

  const isStepBased = timeSpecField.value === TimeSpecification.STEP;

  useEffect(() => {
    if (isStepBased) {
      startPointHelpers.setValue(defaultValues[FieldNames.START_POINT], false);
      startPointHelpers.setTouched(false);
      endPointHelpers.setValue(defaultValues[FieldNames.END_POINT], false);
      endPointHelpers.setTouched(false);
    } else {
      stepsHelpers.setValue(defaultValues[FieldNames.STEPS], false);
      stepsHelpers.setTouched(false);
    }
  }, [isStepBased]);

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
          name={withNamespace(FieldNames.TIME_SPECIFICATION, namespace)}
          optionLeft={{
            value: TimeSpecification.STEP,
            label: "Step",
          }}
          optionRight={{
            value: TimeSpecification.DATETIME,
            label: "Date-Time",
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <FormInput
          name={withNamespace(FieldNames.STEPS, namespace)}
          type="number"
          disabled={!isStepBased}
          InputProps={{ inputProps: { min: 1 } }}
        />
      </Grid>
      <Grid item xs={1}>
        <Typography variant="caption">OR</Typography>
      </Grid>
      <Grid xs={8} item className={classes.datesContainer}>
        <PaddedBox>
          <FormDatepicker
            name={withNamespace(FieldNames.START_POINT, namespace)}
            disabled={isStepBased}
            InputProps={{
              inputProps: { max: endPointField.value },
            }}
          />
        </PaddedBox>
        <PaddedBox>
          <FormDatepicker
            name={withNamespace(FieldNames.END_POINT, namespace)}
            disabled={isStepBased || !startPointField.value}
            InputProps={{
              inputProps: { min: startPointField.value },
            }}
          />
        </PaddedBox>
      </Grid>
    </Grid>
  );
};

export default TimeSpecificationForm;
