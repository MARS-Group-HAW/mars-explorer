import * as React from "react";
import { Button, Grid, makeStyles, Typography } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import useMappingsForm from "./mappings-form.hook";
import FormInput from "../form-input";
import withNamespace from "../../utils/withNamespace";
import FieldNames from "./utils/fieldNames";
import useNodeHeight from "../../../../utils/hooks/use-node-height";

const useStyles = makeStyles(() => ({
  noObjectContainer: {
    height: "100%",
  },
  formContainer: {
    height: "100%",
  },
  nameCountContainer: {
    height: "20%",
    padding: 5,
  },
  mappingContainer: {
    height: "80%",
    padding: 5,
  },
  mappingInputsContainer: {
    padding: 10,
  },
  mappingInput: {},
}));

type Props = {
  namespace: string;
};

// eslint-disable-next-line react/require-default-props
const MappingsForm = ({ namespace }: Props) => {
  const classes = useStyles();
  const { ref, height } = useNodeHeight();
  const { showForm, individualMappingNamespaces, onAddMappingClick } =
    useMappingsForm();

  return (
    <>
      {!showForm && (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          className={classes.noObjectContainer}
        >
          <Typography color="textSecondary">No object selected</Typography>
        </Grid>
      )}
      {showForm && (
        <Grid container className={classes.formContainer}>
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
          <Grid
            ref={ref}
            container
            direction="column"
            className={classes.mappingContainer}
          >
            <Grid container justifyContent="space-between">
              <Typography color="textSecondary">Mapping</Typography>
              <Button
                size="small"
                variant="contained"
                disableElevation
                color="default"
                startIcon={<AddCircleOutlineIcon />}
                onClick={onAddMappingClick}
              >
                Add Mapping
              </Button>
            </Grid>
            <div style={{ height: height - 40, overflowY: "scroll" }}>
              {individualMappingNamespaces.map((mapping, index) => (
                <Grid
                  className={classes.mappingInputsContainer}
                  key={mapping}
                  container
                  justifyContent="space-around"
                >
                  <Grid item xs={7}>
                    <FormInput
                      autoFocus={
                        index === individualMappingNamespaces.length - 1
                      }
                      className={classes.mappingInput}
                      placeholder="Parameter"
                      size="small"
                      name={withNamespace(FieldNames.PARAMETER, mapping)}
                      type="text"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormInput
                      className={classes.mappingInput}
                      placeholder="Value"
                      size="small"
                      name={withNamespace(FieldNames.VALUE, mapping)}
                      type="number"
                    />
                  </Grid>
                </Grid>
              ))}
            </div>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default MappingsForm;
