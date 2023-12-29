/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";

import "./index.css";

import { Provider } from "react-redux";
import store from "./store/redux-toolkit/index.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Toaster />
    <App />
  </Provider>
);
