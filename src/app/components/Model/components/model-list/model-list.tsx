import * as React from "react";
import {
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import useModelList from "./model-list.hook";

function ModelList() {
  const { models, loading, handleModelClick } = useModelList();

  return (
    <List aria-label="models">
      {loading && <LinearProgress />}
      {models.length === 0 && (
        <Typography variant="caption">No Models found</Typography>
      )}
      {models.map((model) => (
        <ListItem
          key={model.path}
          button
          onClick={() => handleModelClick(model)}
        >
          <ListItemText primary={model.name} />
        </ListItem>
      ))}
    </List>
  );
}

export default ModelList;
