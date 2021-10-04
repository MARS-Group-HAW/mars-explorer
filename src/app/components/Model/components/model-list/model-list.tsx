import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Fab,
  LinearProgress,
  List,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { IModelFile } from "@shared/types/Model";
import AddIcon from "@material-ui/icons/Add";
import useModelList from "./model-list.hook";
import ModelListItem from "../model-list-item";

const buttonGroupHeight = 45;

const useStyles = makeStyles((theme) => ({
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

type Props = {
  models: IModelFile[];
  isLoading: boolean;
};

function ModelList({ models, isLoading }: Props) {
  const classes = useStyles();
  const {
    isProjectView,
    isExampleView,
    isModelInvalid,
    isModelSelected,
    showAddButton,
    onModelClick,
    onExamplesButtonClick,
    onMyProjectButtonClick,
    onAddButtonClick,
    onDeleteObjectClick,
  } = useModelList();

  return (
    <>
      <Box>
        <ButtonGroup
          size="small"
          color="secondary"
          aria-label="outlined primary button group"
          className={classes.buttonGroup}
        >
          <Button
            variant={isProjectView ? "contained" : "outlined"}
            onClick={onMyProjectButtonClick}
          >
            My Project
          </Button>
          <Button
            variant={isExampleView ? "contained" : "outlined"}
            onClick={onExamplesButtonClick}
          >
            Examples
          </Button>
        </ButtonGroup>
      </Box>
      <List aria-label="models" className={classes.list}>
        {isLoading && <LinearProgress />}
        {!isLoading && models.length === 0 && (
          <Typography variant="caption">No Models found</Typography>
        )}
        {models.map((model) => (
          <ModelListItem
            key={model.path}
            name={model.name}
            selected={isModelSelected(model)}
            invalid={isModelInvalid(model)}
            onClick={() => onModelClick(model)}
            onDeleteClick={() => onDeleteObjectClick(model)}
          />
        ))}
      </List>
      {showAddButton && (
        <Fab color="primary" className={classes.fab} onClick={onAddButtonClick}>
          <AddIcon />
        </Fab>
      )}
    </>
  );
}

export default ModelList;
