import { createContext, useContext, useMemo, type ReactNode } from "react";
import { usePersistedState } from "./persisted-state";
import { todayIso } from "./dates";
import {
  feelingLabel,
  fitnessLabel,
  initialHistory,
  initialIncidents,
  initialReports,
  initialRoutineAssignments,
} from "./data/followup";
import type {
  Discomfort,
  ExerciseResult,
  HistoryEvent,
  Incident,
  RoutineAssignment,
  RoutineReport,
} from "./types";

export type RoutineDraft = {
  athleteId: string;
  coachId: string;
  date: string;
  title: string;
  note: string;
  exercises: Array<{ name: string; prescription: string }>;
};

export type ReportDraft = {
  results: ExerciseResult[];
  feeling: number;
  effort: number;
  comment: string;
  discomfort?: Discomfort;
  shareWithMedical: boolean;
};

type FollowupStore = {
  routines: RoutineAssignment[];
  reports: RoutineReport[];
  incidents: Incident[];
  history: HistoryEvent[];
  assignRoutine: (draft: RoutineDraft, actor: string) => void;
  submitReport: (assignmentId: string, draft: ReportDraft, actor: string) => Incident | null;
  requestDocs: (incidentId: string, note: string, actor: string) => void;
  sendDocs: (incidentId: string, fileName: string, actor: string) => void;
  shareWithMedical: (incidentId: string, actor: string) => void;
  evaluate: (incidentId: string, evaluation: NonNullable<Incident["evaluation"]>, actor: string) => void;
  closeIncident: (incidentId: string, note: string, actor: string) => void;
  markSeen: (incidentId: string) => void;
};

const FollowupContext = createContext<FollowupStore | null>(null);

let sequence = 0;
function nextId(prefix: string): string {
  sequence += 1;
  return `${prefix}-${Date.now()}-${sequence}`;
}

export function sortHistory(events: HistoryEvent[]): HistoryEvent[] {
  return [...events].reverse().sort((a, b) => b.date.localeCompare(a.date));
}

export function FollowupProvider({ children }: { children: ReactNode }) {
  const [routines, setRoutines] = usePersistedState<RoutineAssignment[]>("routines", initialRoutineAssignments);
  const [reports, setReports] = usePersistedState<RoutineReport[]>("reports", initialReports);
  const [incidents, setIncidents] = usePersistedState<Incident[]>("incidents", initialIncidents);
  const [history, setHistory] = usePersistedState<HistoryEvent[]>("history", initialHistory);

  const value = useMemo<FollowupStore>(() => {
    const log = (row: Omit<HistoryEvent, "id" | "date">) =>
      setHistory((current) => [...current, { ...row, id: nextId("h"), date: todayIso() }]);
    const patchIncident = (id: string, patch: (incident: Incident) => Incident) =>
      setIncidents((current) => current.map((incident) => (incident.id === id ? patch(incident) : incident)));
    const incidentById = (id: string) => incidents.find((incident) => incident.id === id);

    return {
      routines,
      reports,
      incidents,
      history,
      assignRoutine: (draft, actor) => {
        const id = nextId("ra");
        setRoutines((current) => [
          ...current,
          {
            id,
            athleteId: draft.athleteId,
            coachId: draft.coachId,
            date: draft.date,
            title: draft.title,
            note: draft.note,
            status: "assigned",
            exercises: draft.exercises.map((exercise, index) => ({ ...exercise, id: `${id}-e${index + 1}` })),
          },
        ]);
        log({
          athleteId: draft.athleteId,
          kind: "routine",
          title: `Rutina asignada: ${draft.title}`,
          detail: draft.exercises.length === 1 ? "1 ejercicio." : `${draft.exercises.length} ejercicios.`,
          actor,
        });
      },
      submitReport: (assignmentId, draft, actor) => {
        const assignment = routines.find((item) => item.id === assignmentId);
        if (!assignment) return null;
        const reportId = nextId("rp");
        setReports((current) => [
          ...current,
          { ...draft, id: reportId, assignmentId, athleteId: assignment.athleteId, submittedAt: todayIso() },
        ]);
        setRoutines((current) =>
          current.map((item) => (item.id === assignmentId ? { ...item, status: "reported" } : item)),
        );
        const missing = assignment.exercises.filter(
          (exercise) => !draft.results.find((result) => result.exerciseId === exercise.id)?.done,
        );
        const done = assignment.exercises.length - missing.length;
        log({
          athleteId: assignment.athleteId,
          kind: "report",
          title: `Informó la rutina: ${assignment.title}`,
          detail: `${done} de ${assignment.exercises.length} ejercicios hechos. Se sintió: ${feelingLabel[draft.feeling].toLowerCase()}.`,
          actor,
        });

        let incident: Incident | null = null;
        const missingText = missing.length > 0 ? ` No hizo: ${missing.map((item) => item.name).join(", ")}.` : "";
        if (draft.discomfort) {
          const zone = draft.discomfort.zone.toLowerCase();
          incident = {
            id: nextId("inc"),
            athleteId: assignment.athleteId,
            reportId,
            createdAt: todayIso(),
            kind: "discomfort",
            title: `Molestia en ${zone}`,
            detail: `${draft.discomfort.description || "Sin descripción."} Intensidad ${draft.discomfort.intensity} de 10.${missingText}`,
            status: "open",
            sharedWithMedical: draft.shareWithMedical,
            coachSeen: false,
          };
          log({
            athleteId: assignment.athleteId,
            kind: "incident",
            title: `Reportó molestia en ${zone}`,
            detail: `Intensidad ${draft.discomfort.intensity} de 10. ${draft.shareWithMedical ? "Compartida con el equipo médico." : "No la compartió con el equipo médico."}`,
            actor,
            incidentId: incident.id,
          });
        } else if (missing.length > 0) {
          incident = {
            id: nextId("inc"),
            athleteId: assignment.athleteId,
            reportId,
            createdAt: todayIso(),
            kind: "incomplete",
            title: "Ejercicios no completados",
            detail: `${missingText.trim()}${draft.comment ? ` Comentario: «${draft.comment}»` : ""}`,
            status: "open",
            sharedWithMedical: false,
            coachSeen: false,
          };
          log({
            athleteId: assignment.athleteId,
            kind: "incident",
            title: "Ejercicios no completados",
            detail: `${missing.length} de ${assignment.exercises.length} sin hacer.`,
            actor,
            incidentId: incident.id,
          });
        }
        if (incident) {
          const created = incident;
          setIncidents((current) => [created, ...current]);
        }
        return incident;
      },
      requestDocs: (incidentId, note, actor) => {
        const incident = incidentById(incidentId);
        if (!incident) return;
        patchIncident(incidentId, (item) => ({
          ...item,
          status: "docs_requested",
          coachSeen: true,
          docRequest: { requestedAt: todayIso(), note },
        }));
        log({ athleteId: incident.athleteId, kind: "docs", title: "Se pidió documentación médica", detail: note || "Sin nota.", actor, incidentId });
      },
      sendDocs: (incidentId, fileName, actor) => {
        const incident = incidentById(incidentId);
        if (!incident) return;
        patchIncident(incidentId, (item) => ({
          ...item,
          status: "docs_sent",
          docRequest: { requestedAt: item.docRequest?.requestedAt ?? todayIso(), note: item.docRequest?.note ?? "", fileName, sentAt: todayIso() },
        }));
        log({ athleteId: incident.athleteId, kind: "docs", title: "Envió documentación", detail: fileName, actor, incidentId });
      },
      shareWithMedical: (incidentId, actor) => {
        const incident = incidentById(incidentId);
        if (!incident) return;
        patchIncident(incidentId, (item) => ({ ...item, sharedWithMedical: true }));
        log({ athleteId: incident.athleteId, kind: "consent", title: "Autorizó el acceso del equipo médico", detail: incident.title, actor, incidentId });
      },
      evaluate: (incidentId, evaluation, actor) => {
        const incident = incidentById(incidentId);
        if (!incident) return;
        patchIncident(incidentId, (item) => ({ ...item, status: "evaluated", evaluation, coachSeen: false }));
        log({
          athleteId: incident.athleteId,
          kind: "evaluation",
          title: `Evaluación médica: ${fitnessLabel[evaluation.fitness].toLowerCase()}`,
          detail: evaluation.diagnosis,
          actor,
          incidentId,
        });
      },
      closeIncident: (incidentId, note, actor) => {
        const incident = incidentById(incidentId);
        if (!incident) return;
        patchIncident(incidentId, (item) => ({ ...item, status: "closed", closedNote: note, coachSeen: true }));
        log({ athleteId: incident.athleteId, kind: "closed", title: "Incidencia cerrada", detail: note || incident.title, actor, incidentId });
      },
      markSeen: (incidentId) => {
        patchIncident(incidentId, (item) => (item.coachSeen ? item : { ...item, coachSeen: true }));
      },
    };
  }, [history, incidents, reports, routines]);

  return <FollowupContext.Provider value={value}>{children}</FollowupContext.Provider>;
}

export function useFollowup(): FollowupStore {
  const store = useContext(FollowupContext);
  if (!store) {
    throw new Error("useFollowup tiene que usarse dentro de FollowupProvider");
  }
  return store;
}
