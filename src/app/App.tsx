import * as React from "react";
import { Component } from "react";
import { Modeler } from "./Modeler";

export class App extends Component<any, any> {
  componentDidMount() {
    window.api.logger.info("App mounted.");
  }

  render() {
    return <Modeler />;
  }
}
