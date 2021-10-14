import * as React from "react";
import {
  Button,
  Grid,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Link } from "react-router-dom";
import Path from "../../../App/utils/app-paths";

type Props = {
  name: string;
  path: string;
  isSelected: boolean;
  onClick: () => void;
  onDeleteClick: () => void;
};

function UserProjectRow({
  name,
  path,
  onClick,
  onDeleteClick,
  isSelected,
}: Props) {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Typography>{name}</Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="caption">
          {path}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Grid container wrap="nowrap" justifyContent="space-between">
          <IconButton onClick={onDeleteClick} color="default" size="small">
            <DeleteForeverIcon />
          </IconButton>
          <Button
            style={{ marginLeft: 10 }}
            component={Link}
            to={Path.MODEL}
            variant="contained"
            color="primary"
            disabled={isSelected}
            onClick={onClick}
          >
            Open
          </Button>
        </Grid>
      </TableCell>
    </TableRow>
  );
}

export default UserProjectRow;
