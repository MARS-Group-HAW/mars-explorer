import * as React from "react";
import { ReactNode } from "react";
import {
  AppBar,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import TuneIcon from "@material-ui/icons/Tune";
import BarChartIcon from "@material-ui/icons/BarChart";
import { Page } from "../types/Page";

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  headerContainer: {
    padding: theme.spacing(1),
  },
  header: {
    fontWeight: theme.typography.fontWeightBold,
  },
  appBar: {
    // width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    top: "auto",
    bottom: 0,
    zIndex: theme.zIndex.drawer + 1,
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
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

type MenuItem = {
  [key in Page]: {
    text: string;
    icon: ReactNode;
  };
};

const MENU_ITEMS: MenuItem = {
  model: {
    text: "Model",
    icon: <BubbleChartIcon />,
  },
  configure: {
    text: "Configure",
    icon: <TuneIcon />,
  },
  analyze: {
    text: "Analyze",
    icon: <BarChartIcon />,
  },
};

type Props = {
  children: ReactNode;
  page: Page | null;
  onPageChange: (page: Page) => void;
};

export const Sidebar = ({ page, onPageChange, children }: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Drawer
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
            color={"primary"}
            align={"center"}
            variant={"h4"}
            component={"h1"}
          >
            MARS Explorer
          </Typography>
        </Container>
        <Divider />
        <List className={classes.list}>
          {Object.keys(MENU_ITEMS).map((menuItemKey) => {
            const menuItem = MENU_ITEMS[menuItemKey as Page];

            return (
              <ListItem
                button
                key={menuItemKey}
                selected={menuItemKey === page}
                onClick={() => onPageChange(menuItemKey as Page)}
              >
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                <ListItemText primary={menuItem.text} />
              </ListItem>
            );
          })}
        </List>
        <div className={classes.toolbar} />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar variant="dense">
            <Typography variant="h6" noWrap>
              Permanent drawer
            </Typography>
          </Toolbar>
        </AppBar>
      </Drawer>
      <main className={classes.content}>{children}</main>
    </div>
  );
};
