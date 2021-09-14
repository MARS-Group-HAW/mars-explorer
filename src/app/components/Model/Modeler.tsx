import * as React from "react";
import { useRef } from "react";
import {
  Backdrop,
  Box,
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
  spinnerContainer: {
    width: "40%",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
  },
  loadingText: {
    fontWeight: 600,
  },
}));

function Modeler() {
  const classes = useStyles();
  const ref = useRef();
  const {
    loadingMsg,
    showLoading,
    models,
    selectedModelIndex,
    selectModelAtIndex,
    showModelListLoading,
  } = useModeler({
    containerRef: ref,
  });

  return (
    <Grid className={classes.backdropContainer} container>
      <Backdrop className={classes.backdrop} open={showLoading}>
        <Box className={classes.spinnerContainer}>
          <CircularProgress color="secondary" />
          <Typography className={classes.loadingText} variant="h6">
            {`${loadingMsg}`}
          </Typography>
        </Box>
      </Backdrop>
      <Grid item xs={2}>
        <ModelList
          models={models}
          showLoading={showModelListLoading}
          selectedModelIndex={selectedModelIndex}
          selectModelAtIndex={selectModelAtIndex}
        />
      </Grid>
      <Grid id="monaco-container" component="div" innerRef={ref} item xs={10} />
    </Grid>
  );
}

export default Modeler;
