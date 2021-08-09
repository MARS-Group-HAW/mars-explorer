import * as React from "react";
import { Grid } from "@material-ui/core";
import FieldNames from "./fieldNames";
import withNamespace from "../withNamespace";
import FormInput from "../FormComponents/FormInput";
import PaddedBox from "../FormComponents/PaddedBox";
import FormSelect from "../FormComponents/FormSelect";
import { ALL_TIME_UNITS } from "../FormComponents/types";
import TimeSpecificationForm from "./TimeSpecificationForm";

// eslint-disable-next-line react/require-default-props
const GlobalsForm = ({ namespace }: { namespace: string }) => (
  <>
    <PaddedBox>
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
    </PaddedBox>
    <PaddedBox>
      <TimeSpecificationForm namespace={namespace} />
    </PaddedBox>
  </>
);

export default GlobalsForm;
