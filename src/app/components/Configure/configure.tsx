import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Form, Formik } from "formik";
import SaveIcon from "@material-ui/icons/Save";
import {
  Box,
  CircularProgress,
  Fab,
  Snackbar,
  Typography,
} from "@material-ui/core";
import ObjectsForm from "@app/components/Configure/components/objects-form";
import GlobalsForm from "./components/globals-form";
import validationSchema from "./utils/validationSchema";
import FieldNames from "./utils/fieldNames";
import useConfigure from "./hooks";
import useStyles from "./configure-styles";
import OutputsForm from "./components/outputs-form";

export default function Configure() {
  const classes = useStyles();
  const {
    config,
    showNoPathMsg,
    showForm,
    showNewConfigMsg,
    showExistingConfigMsg,
    showSpinner,
    showErrorMsg,
    error,
    handleSubmit,
  } = useConfigure();

  return (
    <div className={classes.root}>
      <Snackbar
        open={showNewConfigMsg}
        message="The config.json could not be found in your project. A default config was created."
        autoHideDuration={3000}
      />
      <Snackbar
        open={showExistingConfigMsg}
        message="Your configuration has been loaded."
        autoHideDuration={3000}
      />
      {showNoPathMsg && (
        <Box>
          <Typography variant="h4">No project selected.</Typography>
        </Box>
      )}
      {showSpinner && <CircularProgress />}
      {showErrorMsg && (
        <Box>
          <Typography variant="h4">{error.name}</Typography>
          <Typography variant="h4">{error.message}</Typography>
        </Box>
      )}
      {showForm && (
        <Formik
          onSubmit={handleSubmit}
          initialValues={config}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <Form>
              <Grid container spacing={3} alignItems="stretch">
                <Grid item xs={6}>
                  <Paper className={classes.paper}>
                    <GlobalsForm namespace={FieldNames.GLOBALS} />
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper className={classes.paper}>
                    <OutputsForm namespace={FieldNames.GLOBALS} />
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <ObjectsForm namespaceAgents={FieldNames.AGENTS} />
                  </Paper>
                </Grid>
              </Grid>
              <Fab
                disabled={Object.keys(formik.errors).length > 0}
                color="primary"
                aria-label="save"
                type="submit"
              >
                <SaveIcon />
              </Fab>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
}
