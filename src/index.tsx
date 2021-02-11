import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { reducer } from "./reducers";
import { createLoguxCreator } from "@logux/redux";
import { badge, badgeEn, log } from "@logux/client";
import { badgeStyles } from "@logux/client/badge/styles";

const createStore = createLoguxCreator({
  subprotocol: "1.0.0",
  server: "ws://localhost:31337",
  userId: "todo",
  token: "",
});

const store = createStore(reducer);
badge(store.client, { messages: badgeEn, styles: badgeStyles });
log(store.client);
store.client.start();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
