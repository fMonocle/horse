import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Panel } from "./types";

const STORAGE_KEY = "horse-demo-session";
const PANEL_KEY = "horse-panel";
const panels: Panel[] = ["owner", "coach", "athlete", "doctor"];

type AuthStore = {
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  panel: Panel;
  setPanel: (panel: Panel) => void;
};

const AuthContext = createContext<AuthStore | null>(null);

function storedPanel(): Panel {
  const value = sessionStorage.getItem(PANEL_KEY) as Panel | null;
  return value && panels.includes(value) ? value : "coach";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === "1",
  );
  const [panel, setPanelState] = useState<Panel>(storedPanel);

  const value = useMemo<AuthStore>(
    () => ({
      signedIn,
      panel,
      setPanel: (next) => {
        sessionStorage.setItem(PANEL_KEY, next);
        setPanelState(next);
      },
      signIn: () => {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setSignedIn(true);
      },
      signOut: () => {
        sessionStorage.removeItem(STORAGE_KEY);
        sessionStorage.removeItem(PANEL_KEY);
        setSignedIn(false);
        setPanelState("coach");
      },
    }),
    [panel, signedIn],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthStore {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error("useAuth tiene que usarse dentro de AuthProvider");
  }
  return store;
}
