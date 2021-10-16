import * as React from "react";
import { useRef } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Tab,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import ContextMenu from "../../../shared/context-menu";

type Props = {
  name: string;
  selected: boolean;
  onClick: () => void;
  onDelete: () => void;
};

function TypeListTab({ name, selected, onClick, onDelete }: Props) {
  const ref = useRef();

  return (
    <>
      <Tab
        ref={ref}
        label={name}
        selected={selected}
        onClick={onClick}
        style={{ textTransform: "none" }}
      />
      <ContextMenu anchorRef={ref}>
        <MenuItem dense disabled>
          {name}
        </MenuItem>
        <MenuItem dense button onClick={onDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" />
        </MenuItem>
      </ContextMenu>
    </>
  );
}

export default TypeListTab;
