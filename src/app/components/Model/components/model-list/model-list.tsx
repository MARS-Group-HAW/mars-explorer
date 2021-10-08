import * as React from "react";
import { Box, Button, ButtonGroup, Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import useModelList, { ModelTabs } from "./model-list.hook";
import MyProjectList from "../my-project-list";
import ExamplesList from "../examples-list";

const buttonGroupHeight = 45;

const useStyles = makeStyles((theme) => ({
  boxContainer: {
    display: "flex",
    justifyContent: "center",
  },
  buttonGroup: {
    padding: 5,
  },
  list: {
    width: "100%",
    height: `calc(100% - ${buttonGroupHeight}px)`,
    overflow: "scroll",
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 999,
  },
}));

function ModelList() {
  const classes = useStyles();
  const { tab, onTabChange, showAddButton, onAddButtonClick } = useModelList();

  const isMyProjectTab = tab === ModelTabs.MY_PROJECT;

  return (
    <>
      <Box className={classes.boxContainer}>
        <ButtonGroup
          size="small"
          color="default"
          disableElevation
          aria-label="outlined primary button group"
          className={classes.buttonGroup}
        >
          <Button
            variant={isMyProjectTab ? "contained" : "outlined"}
            onClick={() => onTabChange(ModelTabs.MY_PROJECT)}
          >
            My Project
          </Button>
          <Button
            variant={!isMyProjectTab ? "contained" : "outlined"}
            onClick={() => onTabChange(ModelTabs.EXAMPLES)}
          >
            Examples
          </Button>
        </ButtonGroup>
      </Box>
      {isMyProjectTab && <MyProjectList />}
      {!isMyProjectTab && <ExamplesList />}
      {showAddButton && (
        <Fab color="primary" className={classes.fab} onClick={onAddButtonClick}>
          <AddIcon />
        </Fab>
      )}
    </>
  );
}

export default ModelList;
