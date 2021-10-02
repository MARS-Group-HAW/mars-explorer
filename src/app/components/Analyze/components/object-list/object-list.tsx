import * as React from "react";
import {
  Checkbox,
  FormLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import {
  toggle,
  useSharedObjectsWithStatus,
} from "../../hooks/use-objects-selection-context";
import { useAppSelector } from "../../../../utils/hooks/use-store";
import { selectSimulationStartingStatus } from "../../../QuickStartBar/utils/simulation-slice";

const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
  },
  skeletonsContainer: {
    height: "100%",
  },
  skeleton: {
    height: 32,
  },
  list: {
    maxHeight: "calc(26vh)",
    overflow: "auto",
  },
}));

function ObjectList() {
  const classes = useStyles();
  const [objectListWithMetaData, dispatch] = useSharedObjectsWithStatus();
  const isLoading = useAppSelector(selectSimulationStartingStatus);

  return (
    <div className={classes.container}>
      <FormLabel component="legend">Which objects to visualize?</FormLabel>
      {isLoading ? (
        <>
          <Skeleton className={classes.skeleton} />
          <Skeleton className={classes.skeleton} />
          <Skeleton className={classes.skeleton} />
        </>
      ) : (
        <List className={classes.list}>
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
      )}
    </div>
  );
}

export default ObjectList;
