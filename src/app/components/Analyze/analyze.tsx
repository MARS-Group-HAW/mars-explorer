import * as React from "react";
import {
  Checkbox,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import useAnalyze from "./hooks";
import LineChart from "./components/line-chart";

const Analyze = () => {
  const { files, toggleFile, selectedFileNames, showListLoading } =
    useAnalyze();

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item xs={3}>
        <List>
          {files.map(({ name, isLoading, isDisabled, isChecked }) => {
            const labelId = `checkbox-list-secondary-label-${name}`;
            return (
              <ListItem
                key={name}
                button
                onClick={() => toggleFile(name)}
                disabled={isDisabled}
              >
                <ListItemIcon>
                  {isLoading && (
                    <CircularProgress variant="indeterminate" size={15} />
                  )}
                </ListItemIcon>
                <ListItemText id={labelId} primary={name} />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    disabled={isDisabled}
                    checked={isChecked}
                    onChange={() => toggleFile(name)}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item xs={9}>
        <LineChart files={selectedFileNames} />
      </Grid>
    </Grid>
  );
};

export default Analyze;
