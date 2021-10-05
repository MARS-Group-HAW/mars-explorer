import "reflect-metadata";
import "./index.css";
import * as React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import store from "./utils/store";
import "./utils/native-overwrites";
import SnackBarProvider from "./components/shared/snackbar";

ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <SnackBarProvider>
        <App />
      </SnackBarProvider>
    </Provider>
  </HashRouter>,
  document.querySelector("#root")
);
