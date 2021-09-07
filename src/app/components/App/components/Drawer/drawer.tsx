import * as React from "react";
import { ReactNode } from "react";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Drawer as MUIDrawer,
  List,
  Typography,
} from "@material-ui/core";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import TuneIcon from "@material-ui/icons/Tune";
import BarChartIcon from "@material-ui/icons/BarChart";
import HomeIcon from "@material-ui/icons/Home";

import QuickStartBar from "@app/components/QuickStartBar";
import Path from "../../utils/app-paths";
import useStyles from "./drawer-styles";
import useDrawer from "./drawer.hook";
import NavItem from "../NavItem";

type Props = {
  children: ReactNode;
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

const Drawer = ({ children }: Props) => {
  const classes = useStyles();
  const { disableNavigation } = useDrawer();

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
            <NavItem
              key={navItem.path}
              disabled={disableNavigation}
              {...navItem}
            />
          ))}
        </List>
        <Divider />
        <Box className={classes.home}>
          <NavItem path={Path.HOME} text="Home" icon={<HomeIcon />} />
        </Box>
        <AppBar position="fixed" className={classes.appBar}>
          <QuickStartBar />
        </AppBar>
      </MUIDrawer>
      <main className={classes.content}>{children}</main>
    </div>
  );
};

export default Drawer;
