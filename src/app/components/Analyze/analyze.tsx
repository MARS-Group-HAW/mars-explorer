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
  const { data, files, selectedFiles, toggleFile, showListLoading } =
    useAnalyze();

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item xs={3}>
        <List>
          {files.map((value) => {
            const labelId = `checkbox-list-secondary-label-${value.name}`;
            const isLoading = data[value.name]?.isLoading;
            return (
              <ListItem
                key={value.name}
                button
                onClick={() => toggleFile(value)}
              >
                <ListItemIcon>
                  {isLoading && (
                    <CircularProgress variant="indeterminate" size={15} />
                  )}
                </ListItemIcon>
                <ListItemText id={labelId} primary={value.name} />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    checked={selectedFiles.indexOf(value) !== -1}
                    onChange={() => toggleFile(value)}
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item xs={9}>
        <LineChart rawData={data} />
      </Grid>
    </Grid>
  );
};

export default Analyze;
