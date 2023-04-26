import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { store } from "./app/store";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SocketContextProvider } from "./context/socketContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import {disableReactDevTools} from '@fvilers/disable-react-devtools'

process.env.NODE_ENV === "production" && disableReactDevTools()

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <SocketContextProvider>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </SocketContextProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
