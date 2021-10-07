import * as React from "react";
import { LinearProgress, List } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useModelList from "./my-project-list.hook";
import ModelListItem from "../model-list-item";
import NoDataMessage from "../../../shared/no-data-message/no-data-message";

const buttonGroupHeight = 45;

const useStyles = makeStyles(() => ({
  list: {
    width: "100%",
    height: `calc(100% - ${buttonGroupHeight}px)`,
    overflow: "scroll",
  },
}));

function MyProjectList() {
  const classes = useStyles();
  const {
    isLoading,
    models,
    isModelInvalid,
    isModelSelected,
    isModelDirty,
    onModelClick,
    onDeleteObjectClick,
  } = useModelList();

  return (
    <List aria-label="models" className={classes.list}>
      {isLoading && <LinearProgress />}
      {!isLoading && models.length === 0 && (
        <NoDataMessage msg="No Models found" />
      )}
      {models.map((model) => (
        <ModelListItem
          key={model.path}
          name={model.name}
          selected={isModelSelected(model)}
          invalid={isModelInvalid(model)}
          dirty={isModelDirty(model)}
          onClick={() => onModelClick(model)}
          onDeleteClick={() => onDeleteObjectClick(model)}
        />
      ))}
    </List>
  );
}

export default MyProjectList;
