import * as React from "react";
import { List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useModelList from "./examples-list.hook";
import ExampleProjectListItem from "../example-project-list-item";

const buttonGroupHeight = 45;

const useStyles = makeStyles(() => ({
  list: {
    width: "100%",
    height: `calc(100% - ${buttonGroupHeight}px)`,
    overflow: "scroll",
  },
}));

function ExamplesList() {
  const classes = useStyles();
  const { projects } = useModelList();

  return (
    <List aria-label="models" className={classes.list}>
      {projects.map((project) => (
        <ExampleProjectListItem key={project.path} project={project} />
      ))}
    </List>
  );
}

export default ExamplesList;
