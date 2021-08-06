import * as React from "react";
import { useEffect } from "react";
import { PageProps } from "../shared/types/Navigation";

const Home = (props: PageProps) => {
  useEffect(() => {
    props.setLoading(false);
  }, []);

  return <p>Home Page</p>;
};

export default Home;
