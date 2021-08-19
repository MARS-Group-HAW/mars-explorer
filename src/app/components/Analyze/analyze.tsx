import * as React from "react";
import useAnalyze from "./hooks";

const Analyze = () => {
  useAnalyze();

  return <p>Analyze content</p>;
};

export default Analyze;
