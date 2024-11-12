import { DevTools, FormatSimple, Tolgee, TolgeeProvider } from "@tolgee/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const tolgee = Tolgee().use(DevTools()).use(FormatSimple()).init({
  language: "en",

  // // for development
  apiUrl: "https://app.tolgee.io",
  apiKey: "tgpak_geytgnrrl43dk2dvofztq3tume3wemtrn5xwe4drgjwtinltnqza",
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TolgeeProvider tolgee={tolgee} fallback="Loading...">
      <App />
    </TolgeeProvider>
  </StrictMode>
);
