import * as React from "react";
import {
  Checkbox,
  FormLabel,
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
    <div>
      <FormLabel component="legend">Which objects to visualize?</FormLabel>
      <List style={{ maxHeight: "calc(25vh)", overflow: "auto" }}>
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
        <ListItem button>
          <ListItemText id="test" primary="test" />
          <ListItemSecondaryAction>
            <Checkbox edge="end" />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText id="test" primary="test" />
          <ListItemSecondaryAction>
            <Checkbox edge="end" />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText id="test" primary="test" />
          <ListItemSecondaryAction>
            <Checkbox edge="end" />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText id="test" primary="test" />
          <ListItemSecondaryAction>
            <Checkbox edge="end" />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText id="test" primary="test" />
          <ListItemSecondaryAction>
            <Checkbox edge="end" />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText id="test" primary="test" />
          <ListItemSecondaryAction>
            <Checkbox edge="end" />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button>
          <ListItemText id="test" primary="test" />
          <ListItemSecondaryAction>
            <Checkbox edge="end" />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </div>
  );
}

export default ObjectList;
