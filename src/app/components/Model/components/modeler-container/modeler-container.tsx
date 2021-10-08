import * as React from "react";
import { Grid, makeStyles } from "@material-ui/core";
import useModelerContainer from "./use-modeler-container.hook";
import NewClassDialog from "../new-class-dialog";
import DeleteClassDialog from "../delete-class-dialog";
import ModelList from "../model-list";
import SaveButton from "../save-button";
import BootstrapScreen from "../bootstrap-screen";

const useStyles = makeStyles(() => ({
  backdropContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  listEditorContainer: {
    width: "100%",
    height: "100%",
  },
  listContainer: {
    position: "relative",
    height: "100%",
    resize: "horizontal",
    overflow: "auto",
    width: 220,
    minWidth: 180,
    maxWidth: "30%",
  },
  editorContainer: {
    width: "100%",
    height: "100%",
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
        <Grid
          direction="column"
          className={classes.listEditorContainer}
          container
        >
          <Grid item className={classes.listContainer}>
            <ModelList />
          </Grid>
          <Grid item className={classes.editorContainer}>
            <div
              className={classes.monacoContainer}
              ref={monacoContainerRef}
              id="monaco-container"
            />
            <SaveButton />
          </Grid>
        </Grid>
      </Grid>
      <NewClassDialog />
      <DeleteClassDialog />
    </>
  );
}

export default ModelerContainer;
