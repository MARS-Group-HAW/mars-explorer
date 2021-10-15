import * as React from "react";
import { Grid } from "@material-ui/core";
import FieldNames from "./utils/fieldNames";
import withNamespace from "../../utils/withNamespace";
import TimeSpecificationForm from "../time-specification-form/time-specification-form";
import FormInput from "../form-input";
import FormSelect from "../form-select";
import { ALL_TIME_UNITS, TimeSpecification } from "./utils/types";
import OutputsForm from "../outputs-form";
import FormPaper from "../form-paper";
import useNamespacedField from "../../hooks/use-namespaced-field";

const GlobalsForm = ({ namespace }: { namespace: string }) => {
  const [{ value }] = useNamespacedField<TimeSpecification>(
    FieldNames.TIME_SPECIFICATION,
    namespace
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <FormPaper>
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
                disabled={value === TimeSpecification.STEP}
                options={ALL_TIME_UNITS.map((unit) => ({
                  label: unit,
                  value: unit,
                }))}
              />
            </Grid>
          </Grid>
          <TimeSpecificationForm />
        </FormPaper>
      </Grid>
      <Grid item xs={6}>
        <FormPaper
          style={{
            backgroundColor: "darkgrey",
            zIndex: 500,
            pointerEvents: "none",
            filter: "blur(3px)",
          }}
        >
          <OutputsForm namespace={namespace} />
        </FormPaper>
      </Grid>
    </Grid>
  );
};

export default GlobalsForm;
