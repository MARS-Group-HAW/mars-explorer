import * as React from "react";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Form, Formik, FormikValues } from "formik";
import SaveIcon from "@material-ui/icons/Save";
import { Fab } from "@material-ui/core";
import { TypeOf } from "yup";
import { PageProps } from "../shared/types/Navigation";
import GlobalsForm from "./GlobalsForm";
import defaultValues from "./defaultValues";
import validationSchema from "./validationSchema";
import FieldNames from "./fieldNames";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
  },
}));

interface ConfigSchema extends TypeOf<typeof validationSchema> {}

export default function Configure(props: PageProps) {
  const classes = useStyles();

  useEffect(() => {
    props.setLoading(false);
  }, []);

  const handleSubmit = (values: FormikValues) => {
    const config: ConfigSchema = validationSchema.validateSync(values);
    window.api.logger.info("Submitting", config);
  };

  return (
    <div className={classes.root}>
      <Formik
        onSubmit={(values) => handleSubmit(values)}
        initialValues={defaultValues}
        validationSchema={validationSchema}
      >
        {(formik) => {
          window.api.logger.error(formik.errors);
          return (
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
          );
        }}
      </Formik>
    </div>
  );
}
