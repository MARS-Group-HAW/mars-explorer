import * as React from "react";
import { useEffect } from "react";
import { PageProps } from "../shared/types/Navigation";

const Analyze = (props: PageProps) => {
  useEffect(() => {
    props.setLoading(false);
  }, []);

  return <p>Analyze content</p>;
};

export default Analyze;
