import * as React from "react";
import { ReactNode } from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { NavLink, useRouteMatch } from "react-router-dom";
import Path from "../../utils/app-paths";

type Props = {
  path: Path;
  text: string;
  disabled?: boolean;
  icon: ReactNode;
};

const NavItem = ({ path, disabled = false, text, icon }: Props) => {
  const matched = useRouteMatch(path);

  return (
    <ListItem
      button
      key={path}
      component={NavLink}
      to={path}
      disabled={disabled}
      selected={matched?.isExact}
      style={{ height: "100%" }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
};

export default NavItem;
