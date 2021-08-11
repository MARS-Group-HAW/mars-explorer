import * as React from "react";
import { PageProps } from "../../util/types/Navigation";
import useAnalyze from "./hooks";

export type Props = PageProps;

const Analyze = (props: Props) => {
  useAnalyze(props);

  return <p>Analyze content</p>;
};

export default Analyze;
