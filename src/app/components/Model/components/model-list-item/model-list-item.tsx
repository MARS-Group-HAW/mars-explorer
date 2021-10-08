import * as React from "react";
import { useRef } from "react";
import {
  Badge,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/core/styles";
import ContextMenu from "../../../shared/context-menu";

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
  const ref = useRef();

  const colorByStatus = () => {
    if (dirty) return "primary";
    if (invalid) return "error";

    return "default";
  };

  return (
    <>
      <ListItem ref={ref} button selected={selected} onClick={onClick}>
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
      <ContextMenu anchorRef={ref}>
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
      </ContextMenu>
    </>
  );
}

export default ModelListItem;
