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
  Toolbar,
  Typography,
} from "@material-ui/core";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import TuneIcon from "@material-ui/icons/Tune";
import BarChartIcon from "@material-ui/icons/BarChart";
import HomeIcon from "@material-ui/icons/Home";

import Path from "../../utils/AppPaths";
import useStyles from "./drawer-styles";
import useDrawer from "./drawer.hook";
import NavItem from "../NavItem";

type Props = {
  children: ReactNode;
  isPageLoading: boolean;
  onPageChange: () => void;
};

const NAV_ITEMS: { path: Path; icon: JSX.Element; text: string }[] = [
  {
    path: Path.MODEL,
    text: "Model",
    icon: <BubbleChartIcon />,
  },
  {
    path: Path.CONFIGURE,
    text: "Configure",
    icon: <TuneIcon />,
  },
  {
    path: Path.ANALYZE,
    text: "Analyze",
    icon: <BarChartIcon />,
  },
];

const Drawer = ({ isPageLoading, onPageChange, children }: Props) => {
  const classes = useStyles();
  const { handleClick } = useDrawer({ onPageChange });

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
          {NAV_ITEMS.map((navItem) => (
            <NavItem key={navItem.path} {...navItem} onClick={handleClick} />
          ))}
        </List>
        <Divider />
        <Box className={classes.home}>
          <NavItem
            path={Path.HOME}
            text="Home"
            icon={<HomeIcon />}
            onClick={handleClick}
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
