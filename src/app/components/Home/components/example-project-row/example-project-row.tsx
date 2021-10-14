import * as React from "react";
import {
  Button,
  Grid,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { IModelFile } from "@shared/types/Model";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import MarkdownParser from "../../../shared/markdown-parser";

type Props = {
  name: string;
  readme: IModelFile;
  onClick: () => void;
};

function ExampleProjectRow({ name, readme, onClick }: Props) {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Typography>{name}</Typography>
      </TableCell>
      <TableCell>
        <Grid container direction="column" justifyContent="center">
          <Tooltip
            title={
              readme ? (
                <MarkdownParser readmeContent={readme.content} />
              ) : (
                "No readme found for this project."
              )
            }
          >
            <InfoOutlinedIcon color={readme ? "primary" : "disabled"} />
          </Tooltip>
        </Grid>
      </TableCell>
      <TableCell align="right">
        <Button
          style={{ marginLeft: 10 }}
          variant="contained"
          color="primary"
          onClick={onClick}
        >
          Copy
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default ExampleProjectRow;
