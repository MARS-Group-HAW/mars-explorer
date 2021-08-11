import * as React from "react";
import { PageProps } from "../../util/types/Navigation";
import useHome from "./hooks/use-home";

const Home = (props: PageProps) => {
  useHome(props);

  return <p>Home Page</p>;
};

export default Home;
