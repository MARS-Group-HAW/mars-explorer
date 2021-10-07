import * as React from "react";
import {
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Paper,
} from "@material-ui/core";
import { ExpandLess, ExpandMore, InfoOutlined } from "@material-ui/icons";
import ExampleProject from "@shared/types/ExampleProject";
import { useBoolean } from "react-use";
import { IModelFile } from "@shared/types/Model";
import {
  deselectExampleProject,
  selectExampleProject,
  selectModel,
  useSharedModels,
} from "../../hooks/use-shared-models";
import ExampleProjectInfoDialog from "../example-project-info-dialog";

type Props = {
  project: ExampleProject;
};

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: theme.spacing(2),
  },
  nested: {
    paddingLeft: theme.spacing(3),
  },
  ellipsis: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

function ExampleProjectListItem({ project }: Props) {
  const classes = useStyles();
  const [{ selectedModel, selectedExampleProject }, dispatch] =
    useSharedModels();

  const [isAboutDialogOpen, setAboutDialogOpen] = useBoolean(false);

  const isSelected = (model: IModelFile) => selectedModel?.path === model.path;

  const onProjectClick = () => {
    if (
      selectedExampleProject &&
      selectedExampleProject.name === project.name
    ) {
      dispatch(deselectExampleProject());
    } else {
      dispatch(selectExampleProject({ project }));
    }
  };

  const onReadMeClick = () => setAboutDialogOpen(true);
  const onReadMeClose = () => setAboutDialogOpen(false);

  const onFileClick = (model: IModelFile) => {
    dispatch(selectModel({ model, isExample: true }));
  };

  const isExpanded = selectedExampleProject?.name === project.name;

  return (
    <Paper className={classes.paper}>
      <ListItem button onClick={onProjectClick}>
        <ListItemText
          primary={project.name}
          primaryTypographyProps={{
            variant: "subtitle2",
            className: classes.ellipsis,
          }}
        />
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Divider variant="middle" />
        <List component="div" disablePadding>
          {project.models.map((model) => (
            <ListItem
              key={model.path}
              button
              className={classes.nested}
              onClick={() => onFileClick(model)}
              selected={isSelected(model)}
            >
              <ListItemText
                primary={model.name}
                primaryTypographyProps={{ className: classes.ellipsis }}
              />
            </ListItem>
          ))}
          <Divider variant="middle" />
          <ListItem
            button
            className={classes.nested}
            onClick={onReadMeClick}
            disabled={!project.readme}
          >
            <ListItemText
              color="primary"
              primary="About"
              primaryTypographyProps={{
                variant: "body2",
                className: classes.ellipsis,
              }}
            />
            <InfoOutlined color="primary" fontSize="small" />
          </ListItem>
        </List>
      </Collapse>
      {isAboutDialogOpen && (
        <ExampleProjectInfoDialog
          readme={project.readme}
          onClose={onReadMeClose}
        />
      )}
    </Paper>
  );
}

export default ExampleProjectListItem;
