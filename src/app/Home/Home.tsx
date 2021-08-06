import * as React from "react";
import { PageProps } from "../shared/types/Navigation";
import { useEffect } from "react";

export const Home = (props: PageProps) => {
  useEffect(() => {
    props.setLoading(false);
  }, []);

  return <p>Home Page</p>;
};
