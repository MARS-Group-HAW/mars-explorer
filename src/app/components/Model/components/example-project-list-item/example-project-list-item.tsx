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
import ModelFile from "../../../../../electron/types/ModelFile";
import {
  deselectExampleProject,
  selectExampleProject,
  selectModel,
  useSharedModels,
} from "../../hooks/use-shared-models";

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

  const isSelected = (model: ModelFile) => selectedModel?.path === model.path;

  const opProjectClick = () => {
    if (
      selectedExampleProject &&
      selectedExampleProject.name === project.name
    ) {
      dispatch(deselectExampleProject());
    } else {
      dispatch(selectExampleProject({ project }));
    }
  };

  const onFileClick = (model: ModelFile) => {
    dispatch(selectModel({ model, isExample: true }));
  };

  const isOpen = selectedExampleProject?.name === project.name;

  return (
    <Paper className={classes.paper}>
      <ListItem button onClick={opProjectClick}>
        <ListItemText
          primary={project.name}
          primaryTypographyProps={{
            variant: "subtitle2",
            className: classes.ellipsis,
          }}
        />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
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
            onClick={() => project.readme && onFileClick(project.readme)}
            selected={project.readme && isSelected(project.readme)}
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
    </Paper>
  );
}

export default ExampleProjectListItem;
