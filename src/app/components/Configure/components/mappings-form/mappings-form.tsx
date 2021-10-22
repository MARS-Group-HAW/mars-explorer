import * as React from "react";
import { ReactNode } from "react";
import {
  Button,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import useMappingsForm from "./mappings-form.hook";
import FormInput from "../form-input";
import withNamespace from "../../utils/withNamespace";
import FieldNames from "./utils/fieldNames";
import useNodeHeight from "../../../../utils/hooks/use-node-height";
import NoDataMessage from "../../../shared/no-data-message/no-data-message";

const useStyles = makeStyles(() => ({
  noObjectContainer: {
    height: "100%",
  },
  formContainer: {
    height: "100%",
  },
  mappingContainer: {
    height: "80%",
  },
  mappingInputsContainer: {
    padding: 10,
  },
  mappingInput: {},
}));

type Props = {
  children: ReactNode;
};

// eslint-disable-next-line react/require-default-props
const MappingsForm = ({ children }: Props) => {
  const classes = useStyles();
  const { ref, height } = useNodeHeight();
  const {
    showForm,
    individualMappingNamespaces,
    onAddMappingClick,
    onDeleteMappingClick,
  } = useMappingsForm();

  return (
    <>
      {!showForm && <NoDataMessage msg="No class selected" />}
      {showForm && (
        <Grid container className={classes.formContainer}>
          {children}
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
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={onAddMappingClick}
              >
                Add Mapping
              </Button>
            </Grid>
            <div style={{ height: height - 40, overflowY: "auto" }}>
              {individualMappingNamespaces.length === 0 && (
                <NoDataMessage msg="No individual mappings" />
              )}
              {individualMappingNamespaces.map((mapping, index) => (
                <Grid
                  className={classes.mappingInputsContainer}
                  key={mapping}
                  container
                  justifyContent="space-around"
                  alignItems="center"
                >
                  <Grid item xs={6}>
                    <FormInput
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
                  <IconButton
                    size="small"
                    color="default"
                    onClick={() => onDeleteMappingClick(index)}
                  >
                    <HighlightOffIcon />
                  </IconButton>
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
