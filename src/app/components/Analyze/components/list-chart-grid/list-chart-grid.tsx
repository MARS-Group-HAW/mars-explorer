import * as React from "react";
import { Grid, makeStyles, Paper } from "@material-ui/core";
import ObjectList from "../object-list";
import LineChart from "../line-chart";
import useListChartGrid from "./list-chart-grid.hook";
import EmptyMessage from "../empty-message";
import ChartSelector from "../chart-selector";
import ChartType from "../../utils/chart-type";
import ScatterChart from "../scatter-chart";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "100%",
  },
  gridContainer: {
    height: "100%",
  },
  inputContainer: {
    padding: theme.spacing(2),
    width: "80%",
    maxWidth: "unset",
  },
  rowContainer: {
    width: "100%",
    height: "100%",
  },
  listContainer: {
    padding: theme.spacing(2),
  },
  chartInputContainer: {
    padding: theme.spacing(2),
  },
  chartContainer: {
    padding: theme.spacing(2),
    width: "90%",
    maxWidth: "unset",
  },
}));

function ListChartGrid() {
  const classes = useStyles();
  const {
    chartType,
    handleChartTypeChange,
    showEmptyMessage,
    showGridAndCharts,
  } = useListChartGrid();

  return (
    <div className={classes.container}>
      {showEmptyMessage && <EmptyMessage />}
      {showGridAndCharts && (
        <Grid
          container
          direction="column"
          className={classes.gridContainer}
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid className={classes.inputContainer} item xs={4}>
            <Grid
              container
              className={classes.rowContainer}
              justifyContent="space-between"
            >
              <Grid
                className={classes.listContainer}
                component={Paper}
                item
                xs={5}
              >
                <ObjectList />
              </Grid>
              <Grid
                className={classes.chartInputContainer}
                component={Paper}
                item
                xs={5}
              >
                <ChartSelector
                  currentChartType={chartType}
                  onChartTypeChange={handleChartTypeChange}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            className={classes.chartContainer}
            item
            xs={7}
            component={Paper}
          >
            {chartType === ChartType.LINE && <LineChart />}
            {chartType === ChartType.SCATTER && <ScatterChart />}
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default ListChartGrid;
