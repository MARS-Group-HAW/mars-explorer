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
import DoneIcon from "@material-ui/icons/Done";
import ModelList from "./components/model-list/model-list";
import useModeler from "./hooks";
import LoadingSteps from "./utils/LoadingSteps";

const listContainerWidth = 200;

const useStyles = makeStyles((theme) => ({
  backdropContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    overflow: "hidden",
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
  doneIcon: {
    color: theme.palette.success.light,
  },
  listContainer: {
    position: "relative",
    width: listContainerWidth,
    height: "100%",
  },
  monacoContainer: {
    width: `calc(100% - ${listContainerWidth}px)`,
  },
}));

function stepToLabel(step: LoadingSteps) {
  switch (step) {
    case LoadingSteps.LANGUAGE_CLIENT_STARTED:
      return "Starting Language Client";
    case LoadingSteps.MONACO_SERVICES_INSTALLED:
      return "Installing Monaco Services";
    case LoadingSteps.LANGUAGE_SERVER_INITIALIZED:
      return "Initializing Language Server";
    case LoadingSteps.MARS_FRAMEWORK_ADDED:
      return "Installing MARS-Framework";
    default:
      return "Unknown loading step";
  }
}

function Modeler() {
  const classes = useStyles();
  const ref = useRef();
  const {
    showLoading,
    models,
    stepWithStatus,
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
          <Grid container direction="column">
            {stepWithStatus.map(({ step, isLoading }) => (
              <Grid
                key={step}
                container
                justifyContent="space-between"
                alignItems="center"
                style={{ marginTop: 2 }}
              >
                <Grid item xs={8}>
                  <Typography style={{ fontWeight: 500 }}>
                    {stepToLabel(step)}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  {isLoading ? (
                    <CircularProgress
                      color="secondary"
                      size={19}
                      variant="indeterminate"
                    />
                  ) : (
                    <DoneIcon className={classes.doneIcon} />
                  )}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Backdrop>
      <div className={classes.listContainer}>
        <ModelList
          models={models}
          showLoading={showModelListLoading}
          selectedModelIndex={selectedModelIndex}
          selectModelAtIndex={selectModelAtIndex}
        />
      </div>
      <div
        className={classes.monacoContainer}
        id="monaco-container"
        ref={ref}
      />
    </Grid>
  );
}

export default Modeler;
