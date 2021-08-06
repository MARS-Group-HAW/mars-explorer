import { ErrorMessage, Field } from "formik";
import * as React from "react";
import FieldNames from "./fieldNames";
import withNamespace from "../withNamespace";

// eslint-disable-next-line react/require-default-props
const GlobalsForm = ({ namespace }: { namespace?: string }) => (
  <>
    <Field
      component="input"
      name={withNamespace(FieldNames.DELTA_T, namespace)}
    />
    <ErrorMessage name={withNamespace(FieldNames.DELTA_T, namespace)} />
    <Field
      component="input"
      name={withNamespace(FieldNames.DELTA_T_UNIT, namespace)}
    />
    <ErrorMessage name={withNamespace(FieldNames.DELTA_T_UNIT, namespace)} />
    <Field
      component="input"
      name={withNamespace(FieldNames.STEPS, namespace)}
    />
    <ErrorMessage name={withNamespace(FieldNames.STEPS, namespace)} />
    <Field
      component="input"
      name={withNamespace(FieldNames.START_POINT, namespace)}
    />
    <ErrorMessage name={withNamespace(FieldNames.START_POINT, namespace)} />
    <Field
      component="input"
      name={withNamespace(FieldNames.END_POINT, namespace)}
    />
    <ErrorMessage name={withNamespace(FieldNames.END_POINT, namespace)} />
  </>
);

export default GlobalsForm;
