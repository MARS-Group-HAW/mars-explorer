import * as React from "react";
import {
  AppBar,
  Box,
  Button,
  Fab,
  Grid,
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tabs,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import useHome, { HomeTab } from "./hooks/use-home";
import Path from "../App/utils/app-paths";
import NewProjectDialog from "./components/new-project-dialog";
import DeleteProjectDialog from "./components/delete-project-dialog";
import CopyProjectDialog from "./components/copy-project-dialog";

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
    processingModel,
    openCreateDialog,
    openDeleteDialog,
    openCopyDialog,
    isModelSelected,
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
              {projects.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <Typography>{row.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textSecondary" variant="caption">
                      {row.path}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Grid
                      container
                      wrap="nowrap"
                      justifyContent="space-between"
                    >
                      <IconButton
                        onClick={() => handleDeleteProjectClick(row)}
                        color="default"
                        size="small"
                        disabled={!isUserProject}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                      {isUserProject ? (
                        <Button
                          style={{ marginLeft: 10 }}
                          component={Link}
                          to={Path.MODEL}
                          variant="contained"
                          color="primary"
                          disabled={isModelSelected(row)}
                          onClick={() => handleProjectClick(row)}
                        >
                          Open
                        </Button>
                      ) : (
                        <Button
                          style={{ marginLeft: 10 }}
                          variant="contained"
                          color="primary"
                          onClick={() => handleExampleProjectClick(row)}
                        >
                          Copy
                        </Button>
                      )}
                    </Grid>
                  </TableCell>
                </TableRow>
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
