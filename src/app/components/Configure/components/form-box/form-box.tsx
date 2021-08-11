import * as React from "react";
import { ReactNode } from "react";
import { Box } from "@material-ui/core";
import useStyles from "./form-box-styles";

const FormBox = ({ children }: { children: ReactNode }) => {
  const classes = useStyles();
  return <Box className={classes.root}>{children}</Box>;
};

export default FormBox;
