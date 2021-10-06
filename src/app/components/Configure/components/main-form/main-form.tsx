import * as React from "react";
import Grid from "@material-ui/core/Grid";
import GlobalsForm from "../globals-form";
import FieldNames from "../../utils/fieldNames";
import TypeForm from "../type-form";

function MainForm() {
  return (
    <Grid container spacing={3} style={{ height: "100%", overflowY: "hidden" }}>
      <Grid item xs={12} style={{ height: "40%" }}>
        <GlobalsForm namespace={FieldNames.GLOBALS} />
      </Grid>
      <Grid item xs={12} style={{ height: "60%" }}>
        <TypeForm />
      </Grid>
    </Grid>
  );
}

export default MainForm;
