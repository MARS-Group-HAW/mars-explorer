import * as React from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Fab,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { WorkingModel } from "@shared/types/Model";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import useModelList from "./model-list.hook";
import NewObjectDialog from "../new-object-dialog";
import DeleteObjectDialog from "../delete-object-dialog";

const buttonGroupHeight = 45;

const useStyles = makeStyles((theme) => ({
  primaryText: {
    width: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
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
  const {
    isProjectView,
    isExampleView,
    showAddButton,
    onExamplesButtonClick,
    onMyProjectButtonClick,
    onAddButtonClick,
    isNewObjectDialogOpen,
    onNewObjectDialogClose,
    objectToDelete,
    onDeleteObjectClick,
    isDeleteObjectDialogOpen,
    onDeleteObjectDialogClose,
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
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => onDeleteObjectClick(model)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {showAddButton && (
        <Fab color="primary" className={classes.fab} onClick={onAddButtonClick}>
          <AddIcon />
        </Fab>
      )}
      <NewObjectDialog
        open={isNewObjectDialogOpen}
        onClose={onNewObjectDialogClose}
      />
      <DeleteObjectDialog
        open={isDeleteObjectDialogOpen}
        onClose={onDeleteObjectDialogClose}
        objectToDelete={objectToDelete}
      />
    </>
  );
}

export default ModelList;
