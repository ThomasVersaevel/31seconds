import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { GameSettingsProvider } from "./context/settingsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GameSettingsProvider>
        <App />
      </GameSettingsProvider>
    </BrowserRouter>
  </StrictMode>
);
