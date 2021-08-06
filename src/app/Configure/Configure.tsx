import * as React from "react";
import { useEffect } from "react";
import { PageProps } from "../shared/types/Navigation";

const Configure = (props: PageProps) => {
  useEffect(() => {
    props.setLoading(false);
  }, []);

  return <p>Configure content</p>;
};

export default Configure;
