import * as React from "react";
import {
  Backdrop,
  CircularProgress,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useBoolean, useMount } from "react-use";
import { Channel } from "@shared/types/Channel";

const useStyles = makeStyles((theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    grid: {
      width: 380,
    },
    message: {},
  })
);

function ShutdownScreen() {
  const classes = useStyles();
  const [open, setOpen] = useBoolean(false);

  useMount(() => window.api.on(Channel.SHUTDOWN, () => setOpen(true)));

  return (
    <Backdrop className={classes.backdrop} open={open}>
      <Grid className={classes.grid} container justifyContent="space-around">
        <Typography className={classes.message} variant="h4">
          Shutting down ...
        </Typography>
        <CircularProgress color="inherit" />
      </Grid>
    </Backdrop>
  );
}

export default ShutdownScreen;
