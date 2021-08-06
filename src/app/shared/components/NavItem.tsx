import * as React from "react";
import { ReactNode } from "react";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { NavLink, useRouteMatch } from "react-router-dom";
import { Path } from "../enums/AppPaths";

type Props = {
  path: Path;
  text: string;
  icon: ReactNode;
  onClick: () => void;
};

export const NavItem = ({ path, text, icon, onClick }: Props) => {
  const matched = useRouteMatch(path);

  return (
    <ListItem
      button
      key={path}
      component={NavLink}
      to={path}
      onClick={onClick}
      selected={matched?.isExact}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
};
