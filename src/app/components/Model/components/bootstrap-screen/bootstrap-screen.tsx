import * as React from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import LoadingSteps from "../../utils/LoadingSteps";
import useStyles from "./boostrap-screen.styles";
import useBootstrapScreen from "./bootstrap-screen.hook";

function stepToLabel(step: LoadingSteps) {
  switch (step) {
    case LoadingSteps.LANGUAGE_CLIENT_STARTED:
      return "Starting Language Client";
    case LoadingSteps.MONACO_SERVICES_INSTALLED:
      return "Installing Monaco Services";
    case LoadingSteps.LANGUAGE_SERVER_INITIALIZED:
      return "Initializing Language Server";
    case LoadingSteps.MODELS_READ:
      return "Reading Models";
    case LoadingSteps.MARS_FRAMEWORK_ADDED:
      return "Installing MARS-Framework";
    default:
      return "Unknown loading step";
  }
}

function BootstrapScreen() {
  const classes = useStyles();
  const { show, stepWithStatus } = useBootstrapScreen();

  return (
    <Backdrop className={classes.backdrop} open={show}>
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
  );
}

export default BootstrapScreen;
