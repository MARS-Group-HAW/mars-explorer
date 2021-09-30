import * as React from "react";
import { Bubble } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { Grid, IconButton, Slider, Typography } from "@material-ui/core";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import useBubbleChart from "./bubble-chart.hook";

const options: ChartOptions = {
  plugins: {
    legend: {
      onClick: () => {}, // suppress for now
    },
    tooltip: {
      callbacks: {
        label(tooltipItem: any): string | string[] {
          const { raw } = tooltipItem;
          return ` ${raw.count} at (${raw.x}, ${raw.y})`;
        },
      },
    },
  },
  elements: {
    point: {
      radius(context) {
        const size = context.chart.width;
        const base = Math.abs((context.raw as any).count) / 1000;
        return (size / 24) * base;
      },
    },
  },
};

function BubbleChart() {
  const { data, tick, maxTick, onTickChange, incrementTick, decrementTick } =
    useBubbleChart();

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-around"
      style={{ height: "100%" }}
    >
      <Bubble data={data} options={options} />
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        direction="row"
      >
        <Typography color="secondary">Tick</Typography>
        <IconButton aria-label="decrement" onClick={decrementTick}>
          <RemoveCircleOutlineIcon />
        </IconButton>
        <Grid
          item
          xs={9}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Slider
            color="secondary"
            value={tick}
            valueLabelDisplay="auto"
            marks
            min={0}
            max={maxTick}
            onChange={(ev, value) => onTickChange(value as number)}
          />
          <Grid container direction="row" justifyContent="space-between">
            <Typography variant="caption" color="textSecondary">
              0
            </Typography>
            <Typography color="secondary" variant="caption">
              Current: {tick}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {maxTick}
            </Typography>
          </Grid>
        </Grid>
        <IconButton aria-label="increment" onClick={incrementTick}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default BubbleChart;
