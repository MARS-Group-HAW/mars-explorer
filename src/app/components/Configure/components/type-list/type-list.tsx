import * as React from "react";
import {
  Fab,
  List,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import useTypeList from "./type-list.hook";
import NoDataMessage from "../../../shared/no-data-message/no-data-message";

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

const TypeList = () => {
  const classes = useStyles();
  const { type, typeNames, selectedIndex, setSelectedIndex, onAddClick } =
    useTypeList();

  const emptyTypes = typeNames.length === 0;

  return (
    <div className={classes.container}>
      {emptyTypes && (
        <NoDataMessage
          msg={`No mappings for ${type} were found. Add one by clicking the Button below.`}
        />
      )}
      {!emptyTypes && (
        <List className={classes.list}>
          {typeNames.map((name, index) => (
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
      )}
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

export default TypeList;
