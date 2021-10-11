import * as React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import useAgentsForm from "./use-agents-form.hook";
import MappingsForm from "../mappings-form";
import FormInput from "../form-input";
import withNamespace from "../../utils/withNamespace";
import FieldNames from "../mappings-form/utils/fieldNames";
import FormFileInput from "../form-file-input";

const useStyles = makeStyles(() => ({
  nameCountContainer: {
    height: "20%",
    padding: 5,
  },
}));

const AgentsForm = () => {
  const classes = useStyles();

  const { namespace } = useAgentsForm();

  return (
    <MappingsForm>
      <Grid
        container
        justifyContent="space-between"
        className={classes.nameCountContainer}
      >
        <Grid item xs={4}>
          <FormInput
            outlined
            name={withNamespace(FieldNames.NAME, namespace)}
          />
        </Grid>
        <Grid item xs={2}>
          <FormInput
            outlined
            name={withNamespace(FieldNames.COUNT, namespace)}
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
        <Grid item xs={5}>
          <FormFileInput
            namespace={withNamespace(FieldNames.FILE, namespace)}
            label={FieldNames.FILE}
          />
        </Grid>
      </Grid>
    </MappingsForm>
  );
};

export default AgentsForm;
