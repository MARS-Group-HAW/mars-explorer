import * as React from "react";
import {
  Fab,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import useObjectList from "./object-list.hook";

const useStyles = makeStyles(() => ({
  container: {
    position: "relative",
    height: "100%",
  },
  list: {
    overflowY: "scroll",
    maxHeight: "100%",
  },
  fab: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 999,
  },
}));

let agentKey = 1;

const ObjectList = () => {
  const classes = useStyles();
  const { objectNames, selectedIndex, setSelectedIndex, onAddClick } =
    useObjectList();

  return (
    <div className={classes.container}>
      <List className={classes.list}>
        {objectNames.map((name, index) => (
          <ListItem
            key={agentKey++}
            button
            selected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          >
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
      <Fab
        color="primary"
        size="small"
        className={classes.fab}
        onClick={onAddClick}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default ObjectList;
