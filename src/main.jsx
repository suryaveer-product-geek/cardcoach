import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Stats from "./Stats.jsx";

// Simple client-side routing — no router library needed
const path = window.location.pathname;
const Component = path === "/stats" ? Stats : App;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Component />
  </React.StrictMode>
);
