import "./player/setup";
import React from "react";
import ReactDOM from "react-dom/client";
import { EmbedApp } from "@vbonline/player";
import "./styles/brand-fonts.css";
import "./styles/brand-tokens.css";
import "./styles/player.css";
import "./styles/styles-embed.css";
import "./styles/styles-motion.css";
import "./styles/brand-player.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EmbedApp />
  </React.StrictMode>,
);
