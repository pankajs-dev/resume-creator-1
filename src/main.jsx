import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import store from "./store";

import "./assets/scss/theme.scss";
import ResumeEdit from "./pages/ResumeBuilder/ResumeEdit";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);

serviceWorker.unregister();
