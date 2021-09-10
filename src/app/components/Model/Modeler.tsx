import * as React from "react";
import { useRef } from "react";
import {
  Backdrop,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import ModelList from "./components/model-list/model-list";
import useModeler from "./hooks";

const useStyles = makeStyles((theme) => ({
  backdropContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    position: "absolute",
  },
}));

function Modeler() {
  const classes = useStyles();
  const ref = useRef();
  const { loadingMsg, showLoading } = useModeler({ containerRef: ref });

  return (
    <Grid className={classes.backdropContainer} container>
      <Backdrop className={classes.backdrop} open={showLoading}>
        <CircularProgress color="secondary" />
        <Typography>{loadingMsg}</Typography>
      </Backdrop>
      <Grid item xs={2}>
        <ModelList />
      </Grid>
      <Grid component="div" innerRef={ref} item xs={10} />
    </Grid>
  );
}

export default Modeler;
