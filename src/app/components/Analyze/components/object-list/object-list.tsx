import * as React from "react";
import {
  Checkbox,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import {
  toggle,
  useSharedObjectsWithStatus,
} from "../../hooks/use-objects-selection-context";

function ObjectList() {
  const [objectListWithMetaData, dispatch] = useSharedObjectsWithStatus();

  return (
    <List>
      {objectListWithMetaData.map(({ name, isChecked }) => {
        const labelId = `checkbox-list-secondary-label-${name}`;
        const toggleFn = () => dispatch(toggle({ name }));
        return (
          <ListItem key={name} button onClick={toggleFn}>
            <ListItemText id={labelId} primary={name} />
            <ListItemSecondaryAction>
              <Checkbox
                edge="end"
                checked={isChecked}
                onChange={toggleFn}
                inputProps={{ "aria-labelledby": labelId }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}

export default ObjectList;
