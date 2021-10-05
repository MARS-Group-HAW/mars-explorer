import * as React from "react";
import "@fontsource/roboto";
import { CssBaseline } from "@material-ui/core";
import { Route } from "react-router-dom";
import Modeler from "@app/components/Model";
import { ErrorBoundary } from "react-error-boundary";
import Drawer from "./components/Drawer";
import Path from "./utils/app-paths";
import Home from "../Home";
import Configure from "../Configure";
import Analyze from "../Analyze";
import useApp from "./hooks";
import ErrorPage from "./components/ErrorPage";

function App() {
  useApp();

  return (
    <ErrorBoundary fallbackRender={(props) => <ErrorPage {...props} />}>
      <CssBaseline>
        <Drawer>
          <Route path={Path.HOME} exact>
            <Home />
          </Route>
          <Route path={Path.MODEL}>
            <Modeler />
          </Route>
          <Route path={Path.CONFIGURE}>
            <Configure />
          </Route>
          <Route path={Path.ANALYZE}>
            <Analyze />
          </Route>
        </Drawer>
      </CssBaseline>
    </ErrorBoundary>
  );
}

export default App;
