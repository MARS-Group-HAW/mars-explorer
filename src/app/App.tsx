import * as React from "react";
import { Component } from "react";
import "@fontsource/roboto";
import { Channel } from "@shared/types/Channel";
import { CssBaseline } from "@material-ui/core";
import { Empty } from "./shared/types/utils";
import { Modeler } from "./Model/Modeler";
import { Route } from "react-router-dom";
import { Configure } from "./Configure/Configure";
import { Analyze } from "./Analyze/Analyze";
import { Home } from "./Home/Home";
import { Path } from "./shared/enums/AppPaths";
import { Drawer } from "./Drawer";

interface State {
  isPageLoading: boolean;
}

export class App extends Component<Empty, State> {
  state: State = {
    isPageLoading: false,
  };

  changePage = () => this.setState({ isPageLoading: true });

  setPageLoading = (isLoading: boolean) =>
    this.setState({ isPageLoading: isLoading });

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
    const { isPageLoading } = this.state;

    return (
      <CssBaseline>
        <Drawer isPageLoading={isPageLoading} onPageChange={this.changePage}>
          <Route path={Path.HOME} exact>
            <Home setLoading={this.setPageLoading} />
          </Route>
          <Route path={Path.MODEL}>
            <Modeler setLoading={this.setPageLoading} />
          </Route>
          <Route path={Path.CONFIGURE}>
            <Configure setLoading={this.setPageLoading} />
          </Route>
          <Route path={Path.ANALYZE}>
            <Analyze setLoading={this.setPageLoading} />
          </Route>
        </Drawer>
      </CssBaseline>
    );
  }
}
