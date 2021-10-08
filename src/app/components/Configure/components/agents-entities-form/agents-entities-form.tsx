import * as React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import MappingsForm from "../mappings-form";
import FormInput from "../form-input";
import withNamespace from "../../utils/withNamespace";
import FieldNames from "../mappings-form/utils/fieldNames";

const useStyles = makeStyles(() => ({
  nameCountContainer: {
    height: "20%",
    padding: 5,
  },
}));

type Props = {
  namespace: string;
};

const AgentsEntitiesForm = ({ namespace }: Props) => {
  const classes = useStyles();

  return (
    <MappingsForm>
      <Grid
        container
        justifyContent="space-between"
        className={classes.nameCountContainer}
      >
        <Grid item>
          <FormInput
            outlined
            name={withNamespace(FieldNames.NAME, namespace)}
          />
        </Grid>
        <Grid item>
          <FormInput
            outlined
            name={withNamespace(FieldNames.COUNT, namespace)}
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
          />
        </Grid>
      </Grid>
    </MappingsForm>
  );
};

export default AgentsEntitiesForm;
