import * as React from "react";
import { Grid } from "@material-ui/core";
import useMappingsForm from "./mappings-form.hook";
import FormInput from "../form-input";
import withNamespace from "../../utils/withNamespace";
import FieldNames from "./utils/fieldNames";

type Props = {
  namespace: string;
};

// eslint-disable-next-line react/require-default-props
const MappingsForm = ({ namespace }: Props) => {
  useMappingsForm(namespace);

  return (
    <Grid container justifyContent="space-between" spacing={3}>
      <Grid item>
        <FormInput name={withNamespace(FieldNames.NAME, namespace)} />
      </Grid>
      <Grid item>
        <FormInput
          name={withNamespace(FieldNames.COUNT, namespace)}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
        />
      </Grid>
    </Grid>
  );
};

export default MappingsForm;
