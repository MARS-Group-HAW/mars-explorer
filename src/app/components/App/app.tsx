import * as React from "react";
import "@fontsource/roboto";
import { CssBaseline } from "@material-ui/core";
import { Route } from "react-router-dom";
import { Provider } from "react-redux";
import Drawer from "./components/Drawer";
import Path from "./utils/app-paths";
import Home from "../Home";
import Modeler from "../Model";
import Configure from "../Configure";
import Analyze from "../Analyze";
import useApp from "./hooks";
import store from "./utils/store";

function App() {
  const { isPageLoading, setPageLoading, onPageChange } = useApp();

  return (
    <CssBaseline>
      <Provider store={store}>
        <Drawer isPageLoading={isPageLoading} onPageChange={onPageChange}>
          <Route path={Path.HOME} exact>
            <Home setLoading={setPageLoading} />
          </Route>
          <Route path={Path.MODEL}>
            <Modeler setLoading={setPageLoading} />
          </Route>
          <Route path={Path.CONFIGURE}>
            <Configure setLoading={setPageLoading} />
          </Route>
          <Route path={Path.ANALYZE}>
            <Analyze setLoading={setPageLoading} />
          </Route>
        </Drawer>
      </Provider>
    </CssBaseline>
  );
}

export default App;
