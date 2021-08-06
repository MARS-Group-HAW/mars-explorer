import * as React from "react";
import { PageProps } from "../shared/types/Navigation";
import { useEffect } from "react";

export const Analyze = (props: PageProps) => {
  useEffect(() => {
    props.setLoading(false);
  }, []);

  return <p>Analyze content</p>;
};
