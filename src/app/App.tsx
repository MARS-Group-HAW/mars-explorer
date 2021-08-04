import * as React from "react";
import { Component } from "react";
import { Modeler } from "./Modeler";
import { Channel } from "@shared/types/Channel";

export class App extends Component<any, any> {
  componentDidMount() {
    window.api.logger.info("App mounted.");
    window.api.on(Channel.DOTNET_NOT_FOUND, this.onDotnetNotFound);
  }

  onDotnetNotFound = () => {
    window.api.logger.warn(".NET SDK not found.");
    alert(
      `Installation of the .NET SDK was not found in your Path. Make sure to have it installed and available in your path. If you've just installed it, try restarting your machine.`
    );
  };

  render() {
    return <Modeler />;
  }
}
