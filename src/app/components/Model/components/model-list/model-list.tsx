import * as React from "react";
import {
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { WorkingModel } from "@shared/types/Model";

const useStyles = makeStyles({
  primaryText: {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

type Props = {
  showLoading: boolean;
  models: WorkingModel;
  selectedModelIndex: number;
  selectModelAtIndex: (index: number) => void;
};

function ModelList({
  showLoading,
  models,
  selectedModelIndex,
  selectModelAtIndex,
}: Props) {
  const classes = useStyles();

  return (
    <List aria-label="models" style={{ width: "100%" }}>
      {showLoading && <LinearProgress />}
      {models.length === 0 && (
        <Typography variant="caption">No Models found</Typography>
      )}
      {models.map((model, index) => (
        <ListItem
          key={model.path}
          button
          selected={selectedModelIndex === index}
          onClick={() => selectModelAtIndex(index)}
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
