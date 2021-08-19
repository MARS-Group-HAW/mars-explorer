import * as React from "react";
import { ReactNode } from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { NavLink, useRouteMatch } from "react-router-dom";
import Path from "../../utils/app-paths";

type Props = {
  path: Path;
  text: string;
  icon: ReactNode;
};

const NavItem = ({ path, text, icon }: Props) => {
  const matched = useRouteMatch(path);

  return (
    <ListItem
      button
      key={path}
      component={NavLink}
      to={path}
      selected={matched?.isExact}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
};

export default NavItem;
