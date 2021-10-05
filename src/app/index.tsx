import "reflect-metadata";
import "./index.css";
import * as React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./components/App";
import store from "./utils/store";
import "./utils/native-overwrites";

ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </HashRouter>,
  document.querySelector("#root")
);
