import { makeStyles } from "@material-ui/core";

const drawerWidth = 180;
const barHeight = 50;

export default makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  headerContainer: {
    padding: theme.spacing(1),
  },
  header: {
    fontWeight: theme.typography.fontWeightBold,
  },
  home: {
    padding: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
  },
  appBar: {
    // width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    top: "auto",
    bottom: 0,
    zIndex: theme.zIndex.drawer + 1,
    height: barHeight,
  },
  list: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-around",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    height: `calc(100% - ${barHeight}px)`,
  },
  // necessary for content to be below app bar
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    height: `calc(100% - ${barHeight}px)`,
    overflowX: "hidden",
  },
  backdrop: {
    height: `calc(100% - ${barHeight}px)`,
    width: `calc(100% - ${drawerWidth}px)`,
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
    right: 0,
    top: 0,
    left: "auto",
  },
}));
