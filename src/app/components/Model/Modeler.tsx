import * as React from "react";
import { useRef } from "react";
import { Grid } from "@material-ui/core";
import { PageProps } from "@app/util/types/Navigation";
import ModelList from "./components/model-list/model-list";
import useModeler from "./hooks";

type Props = PageProps;

function Modeler({ setLoading }: Props) {
  const ref = useRef();
  useModeler({ setLoading, containerRef: ref });

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item xs={2}>
        <ModelList />
      </Grid>
      <Grid component="div" innerRef={ref} item xs={10} />
    </Grid>
  );
}

export default Modeler;
