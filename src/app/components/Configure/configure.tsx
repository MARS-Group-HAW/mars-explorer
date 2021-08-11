import * as React from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Form, Formik } from "formik";
import SaveIcon from "@material-ui/icons/Save";
import { Fab } from "@material-ui/core";
import { PageProps } from "../../util/types/Navigation";
import GlobalsForm from "./components/globals-form";
import defaultValues from "./utils/defaultValues";
import validationSchema from "./utils/validationSchema";
import FieldNames from "./utils/fieldNames";
import useConfigure from "./hooks";
import useStyles from "./configure-styles";

export default function Configure(props: PageProps) {
  const classes = useStyles();
  const { handleSubmit } = useConfigure(props);

  return (
    <div className={classes.root}>
      <Formik
        onSubmit={handleSubmit}
        initialValues={defaultValues}
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
                <Paper className={classes.paper}>xs=6</Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>xs=12</Paper>
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
    </div>
  );
}
