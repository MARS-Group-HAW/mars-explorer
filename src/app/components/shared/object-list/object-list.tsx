import * as React from "react";
import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LoadingIndicator from "../loading-indicator";

const useStyles = makeStyles({
  primaryText: {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  listContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
  },
});

type Props = {
  showLoadingIndicator: boolean;
  objects: string[];
  selectedObject: string;
  onObjectClick: (name: string) => void;
};

function ObjectList({
  showLoadingIndicator,
  objects,
  selectedObject,
  onObjectClick,
}: Props) {
  const classes = useStyles();

  const objectsExist = objects && objects.length > 0;
  const showModelNotFoundMsg = !showLoadingIndicator && !objectsExist;
  const showObjects = !showLoadingIndicator && objectsExist;

  return (
    <List className={classes.listContainer} aria-label="objects">
      <LoadingIndicator
        showLoading={showLoadingIndicator}
        loadingMsg="Loading entries ..."
      />
      {showModelNotFoundMsg && (
        <Typography variant="caption">No objects found</Typography>
      )}
      {showObjects &&
        objects.map((obj) => (
          <ListItem
            key={obj}
            button
            selected={selectedObject === obj}
            onClick={() => onObjectClick(obj)}
          >
            <ListItemText
              primary={obj}
              primaryTypographyProps={{ className: classes.primaryText }}
            />
          </ListItem>
        ))}
    </List>
  );
}

export default ObjectList;
