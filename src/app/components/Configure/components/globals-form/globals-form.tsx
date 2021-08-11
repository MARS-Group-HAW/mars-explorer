import * as React from "react";
import { Grid } from "@material-ui/core";
import FieldNames from "./utils/fieldNames";
import withNamespace from "../../utils/withNamespace";
import FormBox from "../form-box";
import TimeSpecificationForm from "../time-specification-form/time-specification-form";
import FormInput from "../form-input";
import FormSelect from "../form-select";
import { ALL_TIME_UNITS } from "./utils/types";

// eslint-disable-next-line react/require-default-props
const GlobalsForm = ({ namespace }: { namespace: string }) => (
  <>
    <FormBox>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <FormInput
            name={withNamespace(FieldNames.DELTA_T, namespace)}
            type="number"
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
        <Grid item xs={8}>
          <FormSelect
            name={withNamespace(FieldNames.DELTA_T_UNIT, namespace)}
            options={ALL_TIME_UNITS.map((unit) => ({
              label: unit,
              value: unit,
            }))}
          />
        </Grid>
      </Grid>
    </FormBox>
    <FormBox>
      <TimeSpecificationForm namespace={namespace} />
    </FormBox>
  </>
);

export default GlobalsForm;
