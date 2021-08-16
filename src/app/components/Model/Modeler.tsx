import * as React from "react";
import { useRef } from "react";
import { Grid } from "@material-ui/core";
import ProjectList from "./components/project-list/project-list";
import useModeler from "./hooks";
import { PageProps } from "../../util/types/Navigation";

type Props = PageProps;

function Modeler({ setLoading }: Props) {
  const ref = useRef();
  useModeler({ setLoading, containerRef: ref });

  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item xs={2}>
        <ProjectList />
      </Grid>
      <Grid component="div" innerRef={ref} item xs={10} />
    </Grid>
  );
}

export default Modeler;
