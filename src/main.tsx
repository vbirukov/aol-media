import "./player/setup";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/brand-fonts.css";
import "./styles/brand-tokens.css";
import "./styles/welcome.css";
import "./styles/player.css";
import "./styles/styles-motion.css";
import "./styles/styles-material.css";
import "./styles/brand-player.css";
import "./styles/styles-aol-dark.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
