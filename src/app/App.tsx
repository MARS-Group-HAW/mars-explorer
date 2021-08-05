import * as React from "react";
import { Component } from "react";
import "@fontsource/roboto";
import { Channel } from "@shared/types/Channel";
import { CssBaseline } from "@material-ui/core";
import { Sidebar } from "./Sidebar/Sidebar";
import { Page } from "./types/Navigation";
import { Empty } from "./types/utils";
import { Modeler } from "./Modeler";

interface State {
  currentPage: Page | null;
  isPageLoading: boolean;
}

export class App extends Component<Empty, State> {
  state: State = {
    currentPage: null,
    isPageLoading: false,
  };

  changePage = (page: Page) =>
    this.setState({ currentPage: page, isPageLoading: true });

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
    const { isPageLoading, currentPage } = this.state;

    return (
      <CssBaseline>
        <Sidebar
          isPageLoading={isPageLoading}
          page={currentPage}
          onPageChange={this.changePage}
        >
          {currentPage === "model" && (
            <Modeler setLoading={this.setPageLoading} />
          )}
          {currentPage === "configure" && <p>Configure content</p>}
          {currentPage === "analyze" && <p>Analyze content</p>}
        </Sidebar>
      </CssBaseline>
    );
  }
}
