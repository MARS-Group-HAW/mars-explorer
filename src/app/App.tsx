import * as React from "react";
import { Component } from "react";
import "@fontsource/roboto";
import { Channel } from "@shared/types/Channel";
import { CssBaseline } from "@material-ui/core";
import { Sidebar } from "./Sidebar/Sidebar";
import { Page } from "./types/Page";
import { EmptyElement } from "./types/EmptyElement";

interface State {
  currentPage: Page | null;
}

export class App extends Component<EmptyElement, State> {
  state: State = {
    currentPage: null,
  };

  changePage = (page: Page) => this.setState({ currentPage: page });

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
    const { currentPage } = this.state;

    return (
      <CssBaseline>
        <Sidebar page={this.state.currentPage} onPageChange={this.changePage}>
          {currentPage === "model" && <p>Model content</p>}
          {currentPage === "configure" && <p>Configure content</p>}
          {currentPage === "analyze" && <p>Analyze content</p>}
        </Sidebar>
      </CssBaseline>
    );
  }
}
