import * as React from "react";
import {
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import useProjectList from "./project-list.hook";

function ProjectList() {
  const { models, loading, handleModelClick } = useProjectList();

  return (
    <List aria-label="models">
      {loading && <LinearProgress />}
      {models.map((model) => (
        <ListItem
          key={model.path}
          button
          onClick={() => handleModelClick(model)}
        >
          <ListItemText primary={model.name} secondary={model.path} />
        </ListItem>
      ))}
    </List>
  );
}

export default ProjectList;
