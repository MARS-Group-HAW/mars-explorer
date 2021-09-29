import * as React from "react";
import { SharedObjectsWithStatusProvider } from "./hooks/use-objects-selection-context";
import ListChartGrid from "./components/list-chart-grid";

const Analyze = () => (
  <SharedObjectsWithStatusProvider>
    <ListChartGrid />
  </SharedObjectsWithStatusProvider>
);

export default Analyze;
