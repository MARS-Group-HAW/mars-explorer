import * as React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import useModelListItem from "./model-list-item.hook";

const useStyles = makeStyles(() => ({
  primaryText: {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

type Props = {
  name: string;
  selected: boolean;
  onClick: () => void;
  onDeleteClick: () => void;
};

function ModelListItem({ name, selected, onClick, onDeleteClick }: Props) {
  const classes = useStyles();

  const { listItemRef, isMenuOpen, closeMenu } = useModelListItem();

  return (
    <>
      <ListItem ref={listItemRef} button selected={selected} onClick={onClick}>
        <ListItemText
          primary={name}
          primaryTypographyProps={{ className: classes.primaryText }}
        />
      </ListItem>
      <Menu
        anchorEl={listItemRef.current}
        open={isMenuOpen}
        onClose={closeMenu}
      >
        <MenuItem dense disabled>
          {name}
        </MenuItem>
        <MenuItem dense button disabled>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Rename" />
        </MenuItem>
        <MenuItem dense button onClick={onDeleteClick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
    </>
  );
}

export default ModelListItem;
