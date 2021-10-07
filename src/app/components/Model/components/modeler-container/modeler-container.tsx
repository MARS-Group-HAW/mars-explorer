import * as React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import useModelerContainer from "./use-modeler-container.hook";
import NewClassDialog from "../new-class-dialog";
import DeleteClassDialog from "../delete-class-dialog";
import ModelList from "../model-list";
import SaveButton from "../save-button";
import BootstrapScreen from "../bootstrap-screen";

const listContainerWidth = 200;

const useStyles = makeStyles(() => ({
  backdropContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  listContainer: {
    position: "relative",
    width: listContainerWidth,
    height: "100%",
  },
  editorContainer: {
    position: "relative",
    width: `calc(100% - ${listContainerWidth}px)`,
  },
  monacoContainer: {
    height: "100%",
    width: "100%",
  },
}));

function ModelerContainer() {
  const classes = useStyles();
  const { monacoContainerRef } = useModelerContainer();

  return (
    <>
      <Grid className={classes.backdropContainer} container>
        <BootstrapScreen />
        <div className={classes.listContainer}>
          <ModelList />
        </div>
        <div className={classes.editorContainer}>
          <div
            className={classes.monacoContainer}
            ref={monacoContainerRef}
            id="monaco-container"
          />
          <SaveButton />
        </div>
      </Grid>
      <NewClassDialog />
      <DeleteClassDialog />
    </>
  );
}

export default ModelerContainer;
