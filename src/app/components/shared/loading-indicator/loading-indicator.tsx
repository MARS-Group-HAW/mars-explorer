import * as React from "react";
import {
  Backdrop,
  Box,
  CircularProgress,
  makeStyles,
  Typography,
} from "@material-ui/core";

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
  col: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
}));

type Props = {
  showLoading: boolean;
  loadingMsg: string;
};

function LoadingIndicator({ showLoading, loadingMsg }: Props) {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={showLoading}>
      <Box className={classes.spinnerContainer}>
        <div className={classes.col}>
          <CircularProgress color="secondary" />
          <Typography className={classes.loadingText} variant="h6">
            {loadingMsg}
          </Typography>
        </div>
      </Box>
    </Backdrop>
  );
}

export default LoadingIndicator;
