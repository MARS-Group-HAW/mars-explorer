import * as React from "react";
import { PageProps } from "../shared/types/Navigation";
import { useEffect } from "react";

export const Configure = (props: PageProps) => {

  useEffect(() => {
    props.setLoading(false);
  }, []);

  return <p>Configure content</p>;
};
