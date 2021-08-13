import * as React from "react";
import { Grid } from "@material-ui/core";
import FormBox from "../form-box";
import FormSelect from "../form-select/form-select";
import withNamespace from "../../utils/withNamespace";
import FieldNames from "./utils/fieldNames";
import { ALL_DELIMITERS } from "./utils/types";
import FormInput from "../form-input";
import FormCheckbox from "../form-checkbox";

type Props = {
  namespace: string;
};

function OutputsCsvForm({ namespace }: Props) {
  return (
    <FormBox>
      <Grid
        container
        spacing={2}
        direction="column"
        justifyContent="space-between"
        style={{ height: "100%" }}
      >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormSelect
              name={withNamespace(FieldNames.DELIMITER, namespace)}
              options={ALL_DELIMITERS.map((delimiter) => ({
                label: delimiter,
                value: delimiter,
              }))}
            />
          </Grid>
          <Grid item xs={4}>
            <FormInput name={withNamespace(FieldNames.ENCODING, namespace)} />
          </Grid>
          <Grid item xs={4}>
            <FormInput name={withNamespace(FieldNames.CULTURE, namespace)} />
          </Grid>
        </Grid>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={6}>
            <FormInput
              name={withNamespace(FieldNames.FILE_SUFFIX, namespace)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormCheckbox
              name={withNamespace(FieldNames.INCLUDE_HEADER, namespace)}
            />
          </Grid>
        </Grid>
      </Grid>
    </FormBox>
  );
}

export default OutputsCsvForm;
