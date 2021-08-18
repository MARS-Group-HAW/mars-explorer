import * as React from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { PageProps } from "../../util/types/Navigation";
import useHome from "./hooks/use-home";
import Path from "../App/utils/app-paths";

const useStyles = makeStyles((theme) => ({
  table: {
    padding: theme.spacing(2),
  },
}));

const Home = (props: PageProps) => {
  const classes = useStyles();
  const { projects, handleProjectClick } = useHome(props);

  return (
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
                  {row.name}
                </TableCell>
                <TableCell>{row.path}</TableCell>
                <TableCell align="right">
                  <Link to={Path.MODEL}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleProjectClick(row)}
                    >
                      Open
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Home;
