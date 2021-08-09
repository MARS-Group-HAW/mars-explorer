import * as React from "react";
import { ReactNode } from "react";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
  },
}));

const PaddedBox = ({ children }: { children: ReactNode }) => {
  const classes = useStyles();
  return <Box className={classes.root}>{children}</Box>;
};

export default PaddedBox;
