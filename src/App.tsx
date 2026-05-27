import { useEffect, useState } from "react";
import { PlayerApp } from "@vbonline/player";
import { AppHeader } from "./components/AppHeader";
import { HubEntrySync } from "./components/HubEntrySync";
import { HubLibraryHero } from "./components/HubLibraryHero";
import { WelcomePage } from "./components/WelcomePage";
import {
  getInitialScreen,
  readScreenFromHash,
  type AppScreen,
} from "./lib/appRoute";

export default function App() {
  const [screen, setScreen] = useState<AppScreen>(getInitialScreen);

  useEffect(() => {
    const onHash = () => setScreen(readScreenFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (screen === "welcome") {
    return <WelcomePage />;
  }

  return (
    <>
      <HubEntrySync />
      <PlayerApp
        renderHeader={(props) => <AppHeader {...props} />}
        renderHero={(props) => <HubLibraryHero {...props} />}
      />
    </>
  );
}
