import * as React from "react";
import { ReactNode } from "react";
import {
  AppBar,
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Divider,
  Drawer as MUIDrawer,
  List,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import TuneIcon from "@material-ui/icons/Tune";
import BarChartIcon from "@material-ui/icons/BarChart";
import HomeIcon from "@material-ui/icons/Home";

import NavItem from "./shared/components/NavItem";
import Path from "./shared/enums/AppPaths";

const drawerWidth = 180;
const barHeight = 50;

const useStyles = makeStyles((theme) => ({
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

type Props = {
  children: ReactNode;
  isPageLoading: boolean;
  onPageChange: () => void;
};

const Drawer = ({ isPageLoading, onPageChange, children }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MUIDrawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <Container className={classes.headerContainer}>
          <Typography
            className={classes.header}
            color="primary"
            align="center"
            variant="h4"
            component="h1"
          >
            MARS Explorer
          </Typography>
        </Container>
        <Divider />
        <List className={classes.list} component="nav">
          <NavItem
            path={Path.MODEL}
            text="Model"
            icon={<BubbleChartIcon />}
            onClick={() => onPageChange()}
          />
          <NavItem
            path={Path.CONFIGURE}
            text="Configure"
            icon={<TuneIcon />}
            onClick={() => onPageChange()}
          />
          <NavItem
            path={Path.ANALYZE}
            text="Analyze"
            icon={<BarChartIcon />}
            onClick={() => onPageChange()}
          />
        </List>
        <Divider />
        <Box className={classes.home}>
          <NavItem
            path={Path.HOME}
            text="Home"
            icon={<HomeIcon />}
            onClick={() => onPageChange()}
          />
        </Box>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar variant="dense">
            <Typography variant="h6" noWrap>
              Permanent drawer
            </Typography>
          </Toolbar>
        </AppBar>
      </MUIDrawer>
      <main className={classes.content}>
        <Backdrop className={classes.backdrop} open={isPageLoading}>
          <CircularProgress color="secondary" />
        </Backdrop>
        {children}
      </main>
    </div>
  );
};

export default Drawer;
