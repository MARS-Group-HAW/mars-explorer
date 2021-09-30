import * as React from "react";
import {
  Box,
  Button,
  Fab,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import useHome from "./hooks/use-home";
import Path from "../App/utils/app-paths";
import NewProjectDialog from "./components/new-project-dialog";
import DeleteProjectDialog from "./components/delete-project-dialog";

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
    projects,
    processingModel,
    openCreateDialog,
    openDeleteDialog,
    isModelSelected,
    handleProjectClick,
    handleNewProjectClick,
    handleNewProjectClose,
    handleDeleteProjectClick,
    handleDeleteProjectClose,
  } = useHome();

  return (
    <>
      <Box className={classes.table}>
        <TableContainer component={Paper}>
          <Table aria-label="user projects">
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell>Path</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
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
                      >
                        <DeleteForeverIcon />
                      </IconButton>
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
