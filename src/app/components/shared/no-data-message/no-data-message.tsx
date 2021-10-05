import * as React from "react";
import { Grid, Typography } from "@material-ui/core";

type Props = {
  msg: string;
};

function NoDataMessage({ msg }: Props) {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100%", width: "100%" }}
    >
      <Typography style={{ textAlign: "justify" }} color="textSecondary">
        {msg}
      </Typography>
    </Grid>
  );
}

export default NoDataMessage;
