import * as React from "react";
import { Formik } from "formik";
import { Box, CircularProgress, Typography } from "@material-ui/core";
import { Prompt } from "react-router-dom";
import validationSchema from "./utils/validationSchema";
import useConfigure from "./hooks";
import useStyles from "./configure-styles";
import NoDataMessage from "../shared/no-data-message/no-data-message";
import SubmitButton from "./components/submit-button";
import MainForm from "./components/main-form";
import FormikWatcher from "./components/formik-watcher";

export default function Configure() {
  const classes = useStyles();
  const {
    config,
    showNoPathMsg,
    showForm,
    showLoading,
    hasUnsavedChanges,
    handleSubmit,
  } = useConfigure();

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
      <Prompt
        when={hasUnsavedChanges}
        message={() =>
          `You have unsaved changes in your config. Do you really want to leave?`
        }
      />
      {showForm && (
        <Formik
          onSubmit={handleSubmit}
          initialValues={config}
          validationSchema={validationSchema}
        >
          <>
            <MainForm />
            <FormikWatcher />
            <SubmitButton />
          </>
        </Formik>
      )}
    </div>
  );
}
