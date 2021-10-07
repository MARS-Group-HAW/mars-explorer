import { makeStyles } from "@material-ui/core";

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
}));

export default useStyles;
