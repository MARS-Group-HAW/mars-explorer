import * as React from "react";
import Grid from "@material-ui/core/Grid";
import { Formik } from "formik";
import SaveIcon from "@material-ui/icons/Save";
import { Box, CircularProgress, Fab, Typography } from "@material-ui/core";
import TypeForm from "@app/components/Configure/components/type-form";
import GlobalsForm from "./components/globals-form";
import validationSchema from "./utils/validationSchema";
import FieldNames from "./utils/fieldNames";
import useConfigure from "./hooks";
import useStyles from "./configure-styles";
import NoDataMessage from "../shared/no-data-message/no-data-message";

export default function Configure() {
  const classes = useStyles();
  const { config, showNoPathMsg, showForm, showLoading, handleSubmit } =
    useConfigure();

  return (
    <div className={classes.root}>
      {showNoPathMsg && <NoDataMessage msg="No project selected" />}
      {showLoading && (
        <Box className={classes.loadingContainer}>
          <CircularProgress size={50} />
          <Typography color="textSecondary">
            Loading your configuration ...
          </Typography>
        </Box>
      )}
      {showForm && (
        <Formik
          onSubmit={handleSubmit}
          initialValues={config}
          validationSchema={validationSchema}
        >
          {(formik) => (
            <>
              <Grid
                container
                spacing={3}
                style={{ height: "100%", overflowY: "hidden" }}
              >
                <Grid item xs={12} style={{ height: "40%" }}>
                  <GlobalsForm namespace={FieldNames.GLOBALS} />
                </Grid>
                <Grid item xs={12} style={{ height: "60%" }}>
                  <TypeForm />
                </Grid>
              </Grid>
              <Fab
                style={{
                  position: "absolute",
                  bottom: 60,
                  right: 10,
                }}
                disabled={Object.keys(formik.errors).length > 0}
                color="secondary"
                aria-label="save"
                type="submit"
                onClick={() => formik.submitForm()}
              >
                <SaveIcon />
              </Fab>
            </>
          )}
        </Formik>
      )}
    </div>
  );
}
