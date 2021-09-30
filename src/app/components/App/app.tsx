import * as React from "react";
import "@fontsource/roboto";
import { CssBaseline } from "@material-ui/core";
import { Route } from "react-router-dom";
import Modeler from "@app/components/Model";
import Drawer from "./components/Drawer";
import Path from "./utils/app-paths";
import Home from "../Home";
import Configure from "../Configure";
import Analyze from "../Analyze";
import useApp from "./hooks";
import SnackBarProvider from "../shared/snackbar";

function App() {
  useApp();

  return (
    <CssBaseline>
      <SnackBarProvider>
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
      </SnackBarProvider>
    </CssBaseline>
  );
}

export default App;
