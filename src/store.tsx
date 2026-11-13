import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { initialSessions } from "./data/seed";
import type { Session, SessionDraft } from "./types";

type TrainingStore = {
  sessions: Session[];
  addSession: (draft: SessionDraft) => void;
  toggleCompleted: (id: string) => void;
};

const TrainingContext = createContext<TrainingStore | null>(null);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  const value = useMemo<TrainingStore>(
    () => ({
      sessions,
      addSession: (draft) => {
        setSessions((current) => [
          {
            ...draft,
            id: `s-${Date.now()}`,
            completed: false,
          },
          ...current,
        ]);
      },
      toggleCompleted: (id) => {
        setSessions((current) =>
          current.map((session) =>
            session.id === id ? { ...session, completed: !session.completed } : session,
          ),
        );
      },
    }),
    [sessions],
  );

  return <TrainingContext.Provider value={value}>{children}</TrainingContext.Provider>;
}

export function useTraining(): TrainingStore {
  const store = useContext(TrainingContext);
  if (!store) {
    throw new Error("useTraining tiene que usarse dentro de TrainingProvider");
  }
  return store;
}
