import { Buffer } from 'buffer';
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Make Buffer available globally for browser compatibility
(window as any).Buffer = Buffer;

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "./styles/globals.css";
import "./test-ethers";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);