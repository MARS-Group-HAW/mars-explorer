import * as React from "react";
import {
  AppBar,
  Box,
  Fab,
  Paper,
  Tab,
  Table,
  TableBody,
  TableContainer,
  Tabs,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import useHome, { HomeTab } from "./hooks/use-home";
import NewProjectDialog from "./components/new-project-dialog";
import DeleteProjectDialog from "./components/delete-project-dialog";
import CopyProjectDialog from "./components/copy-project-dialog";
import UserProjectRow from "./components/user-project-row";
import ExampleProjectRow from "./components/example-project-row";

const useStyles = makeStyles((theme) => ({
  table: {
    padding: theme.spacing(2),
  },
  fab: {
    position: "absolute",
    bottom: 50 + theme.spacing(2), // quickbar size
    right: theme.spacing(2),
  },
}));

const Home = () => {
  const classes = useStyles();
  const {
    tab,
    onTabChange,
    projects,
    exampleProjects,
    processingModel,
    openCreateDialog,
    openDeleteDialog,
    openCopyDialog,
    isModelSelected,
    hasModelBeenCopied,
    handleProjectClick,
    handleExampleProjectClick,
    handleNewProjectClick,
    handleNewProjectClose,
    handleDeleteProjectClick,
    handleDeleteProjectClose,
    handleCopyProjectClose,
  } = useHome();

  const isUserProject = tab === HomeTab.MY_PROJECTS;

  return (
    <>
      <Box className={classes.table}>
        <AppBar position="static">
          <Tabs
            centered
            value={tab}
            onChange={(ev, index) => onTabChange(index)}
          >
            <Tab label="My Projects" value={HomeTab.MY_PROJECTS} />
            <Tab label="Examples" value={HomeTab.EXAMPLES} />
          </Tabs>
        </AppBar>
        <TableContainer component={Paper}>
          <Table aria-label="user projects">
            <TableBody>
              {isUserProject &&
                projects.map((row) => (
                  <UserProjectRow
                    key={row.path}
                    name={row.name}
                    path={row.path}
                    isSelected={isModelSelected(row)}
                    onClick={() => handleProjectClick(row)}
                    onDeleteClick={() => handleDeleteProjectClick(row)}
                  />
                ))}
              {!isUserProject &&
                exampleProjects.map((row) => (
                  <ExampleProjectRow
                    key={row.path}
                    name={row.name}
                    readme={row.readme}
                    disabled={hasModelBeenCopied(row)}
                    onClick={() => handleExampleProjectClick(row)}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <NewProjectDialog
        open={openCreateDialog}
        onClose={handleNewProjectClose}
      />
      <DeleteProjectDialog
        fileRef={processingModel}
        open={openDeleteDialog}
        onClose={handleDeleteProjectClose}
      />
      <CopyProjectDialog
        projectToCopy={processingModel}
        open={openCopyDialog}
        onCopy={() => onTabChange(HomeTab.MY_PROJECTS)}
        onClose={handleCopyProjectClose}
      />
      <Fab
        className={classes.fab}
        color="primary"
        aria-label="add"
        variant="extended"
        onClick={handleNewProjectClick}
      >
        <AddIcon />
        Create new Project
      </Fab>
    </>
  );
};

export default Home;
