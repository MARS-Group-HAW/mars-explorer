import * as React from "react";
import { Fab, makeStyles, Tabs } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import useTypeList from "./type-list.hook";
import NoDataMessage from "../../../shared/no-data-message/no-data-message";
import TypeListTab from "../type-list-tab";

const useStyles = makeStyles(() => ({
  container: {
    position: "relative",
    height: "100%",
  },
  list: {
    overflowY: "auto",
    height: "100%",
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
  const {
    type,
    typeNames,
    selectedIndex,
    setSelectedIndex,
    onAddClick,
    onDeleteClick,
  } = useTypeList();

  const emptyTypes = typeNames.length === 0;

  return (
    <div className={classes.container}>
      {emptyTypes && (
        <NoDataMessage
          msg={`No mappings for ${type} were found. Add one by clicking the Button below.`}
        />
      )}
      {!emptyTypes && (
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selectedIndex}
          className={classes.list}
        >
          {typeNames.map((name, index) => (
            <TypeListTab
              key={agentKey++}
              name={name}
              selected={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
              onDelete={() => onDeleteClick(index)}
            />
          ))}
        </Tabs>
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
