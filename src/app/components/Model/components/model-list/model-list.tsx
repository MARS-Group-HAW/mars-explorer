import * as React from "react";
import {
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useModelList from "./model-list.hook";

const useStyles = makeStyles({
  primaryText: {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

function ModelList() {
  const classes = useStyles();
  const {
    selectedModel,
    models,
    showLoading,
    showEmptyModels,
    handleModelClick,
  } = useModelList();

  return (
    <List aria-label="models" style={{ width: "100%" }}>
      {showLoading && <LinearProgress />}
      {showEmptyModels && (
        <Typography variant="caption">No Models found</Typography>
      )}
      {models.map((model) => (
        <ListItem
          key={model.path}
          button
          selected={model === selectedModel}
          onClick={() => handleModelClick(model)}
        >
          <ListItemText
            primary={model.name}
            primaryTypographyProps={{ className: classes.primaryText }}
          />
        </ListItem>
      ))}
    </List>
  );
}

export default ModelList;
