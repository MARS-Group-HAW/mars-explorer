import * as React from "react";
import { Typography } from "@material-ui/core";
import HelpIcon from "@material-ui/icons/Help";
import { CSSProperties } from "react";

const styles: CSSProperties = {
  color: "grey",
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};

const EmptyMessage = () => (
  <div style={styles}>
    <HelpIcon fontSize="large" />
    <Typography variant="h6">No results found.</Typography>
    <Typography component="span" variant="caption">
      Did you start a simulation yet? The live results should show up here.
    </Typography>
  </div>
);

export default EmptyMessage;
