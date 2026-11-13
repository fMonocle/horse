import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Panel } from "./types";

const STORAGE_KEY = "horse-demo-session";

type AuthStore = {
  signedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  panel: Panel;
  setPanel: (panel: Panel) => void;
};

const AuthContext = createContext<AuthStore | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === "1",
  );
  const [panel, setPanel] = useState<Panel>("coach");

  const value = useMemo<AuthStore>(
    () => ({
      signedIn,
      panel,
      setPanel,
      signIn: () => {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setSignedIn(true);
      },
      signOut: () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setSignedIn(false);
        setPanel("coach");
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
