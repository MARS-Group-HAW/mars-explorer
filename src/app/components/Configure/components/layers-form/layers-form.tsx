import * as React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import useLayersForm from "./use-layers-form.hook";
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

const LayersForm = () => {
  const classes = useStyles();
  const { namespace } = useLayersForm();

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
          <FormFileInput
            namespace={withNamespace(FieldNames.FILE, namespace)}
            label={FieldNames.FILE}
          />
        </Grid>
      </Grid>
    </MappingsForm>
  );
};

export default LayersForm;
