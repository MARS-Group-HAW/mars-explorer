import * as React from "react";
import {
  Badge,
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

const useStyles = makeStyles((theme) => ({
  primaryText: {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    paddingLeft: 10,
  },
  error: {
    backgroundColor: theme.palette.error.light,
  },
}));

type Props = {
  name: string;
  selected: boolean;
  invalid: boolean;
  dirty: boolean;
  onClick: () => void;
  onDeleteClick: () => void;
};

function ModelListItem({
  name,
  selected,
  invalid,
  dirty,
  onClick,
  onDeleteClick,
}: Props) {
  const classes = useStyles();

  const { listItemRef, isMenuOpen, closeMenu } = useModelListItem();

  const colorByStatus = () => {
    if (dirty) return "primary";
    if (invalid) return "error";

    return "default";
  };

  return (
    <>
      <ListItem ref={listItemRef} button selected={selected} onClick={onClick}>
        <Badge
          color={colorByStatus()}
          variant="dot"
          invisible={!dirty && !invalid}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <ListItemText
            primary={name}
            primaryTypographyProps={{ className: classes.primaryText }}
          />
        </Badge>
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
