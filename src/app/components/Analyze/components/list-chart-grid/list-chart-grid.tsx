import * as React from "react";
import { Grid } from "@material-ui/core";
import ObjectList from "../object-list";
import LineChart from "../line-chart";
import useListChartGrid from "./list-chart-grid.hook";
import EmptyMessage from "../empty-message";

function ListChartGrid() {
  const { showEmptyMessage, showGridAndCharts } = useListChartGrid();

  return (
    <>
      {showEmptyMessage && <EmptyMessage />}
      {showGridAndCharts && (
        <Grid container style={{ height: "100%" }}>
          <Grid item xs={3}>
            <ObjectList />
          </Grid>
          <Grid item xs={9}>
            <LineChart />
          </Grid>
        </Grid>
      )}
    </>
  );
}

export default ListChartGrid;
