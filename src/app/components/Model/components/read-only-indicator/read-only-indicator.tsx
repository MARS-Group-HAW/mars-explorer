import * as React from "react";
import { makeStyles, Tooltip } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { useSharedModels } from "../../hooks/use-shared-models";

const useStyles = makeStyles((theme) => ({
  eyeIcon: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function ReadOnlyIndicator() {
  const classes = useStyles();
  const [{ isExampleProject }] = useSharedModels();

  return (
    <>
      {isExampleProject && (
        <Tooltip title="Read-Only View">
          <VisibilityIcon
            fontSize="large"
            className={classes.eyeIcon}
            color="secondary"
          />
        </Tooltip>
      )}
    </>
  );
}

export default ReadOnlyIndicator;
