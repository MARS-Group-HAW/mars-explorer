import * as React from "react";
import "@fontsource/roboto";
import { CssBaseline } from "@material-ui/core";
import { Route } from "react-router-dom";
import { Provider } from "react-redux";
import Modeler from "@app/components/Model";
import Drawer from "./components/Drawer";
import Path from "./utils/app-paths";
import Home from "../Home";
import Configure from "../Configure";
import Analyze from "../Analyze";
import useApp from "./hooks";
import store from "./utils/store";

function App() {
  useApp();

  return (
    <CssBaseline>
      <Provider store={store}>
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
      </Provider>
    </CssBaseline>
  );
}

export default App;
