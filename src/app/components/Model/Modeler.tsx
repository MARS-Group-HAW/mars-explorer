import * as React from "react";
import { useRef } from "react";
import useModeler from "./hooks";

type Props = any;

function Modeler(props: Props) {
  const ref = useRef();
  useModeler({ ...props, containerRef: ref });

  return <div ref={ref} style={{ height: "100%", width: "100%" }} />;
}

export default Modeler;
