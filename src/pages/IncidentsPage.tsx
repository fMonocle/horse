import { Empty, Segmented, Select, Tag } from "antd";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useVisibleIncidents } from "../access";
import { useAuth } from "../auth";
import { formatShort } from "../dates";
import { athleteName, athletes } from "../data/athletes";
import { incidentStatusColor, incidentStatusLabel } from "../data/followup";

type Scope = "open" | "all" | "closed";

export function IncidentsPage() {
  const { panel } = useAuth();
  const incidents = useVisibleIncidents();
  const [scope, setScope] = useState<Scope>("open");
  const [athleteId, setAthleteId] = useState<string>();

  const people = useMemo(() => {
    const ids = new Set(incidents.map((incident) => incident.athleteId));
    return athletes.filter((athlete) => ids.has(athlete.id));
  }, [incidents]);

  const rows = incidents
    .filter((incident) => (scope === "all" ? true : scope === "closed" ? incident.status === "closed" : incident.status !== "closed"))
    .filter((incident) => !athleteId || incident.athleteId === athleteId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const count = (status: string) => incidents.filter((incident) => incident.status === status).length;

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Incidencias</h1>
          <p>
            {panel === "doctor"
              ? "Las que los deportistas autorizaron a compartir con el equipo médico."
              : "Molestias y ejercicios sin completar que informaron tus deportistas."}
          </p>
        </div>
      </div>
      <div className="stat-grid">
        <article className="stat-card tone-alert">
          <span>Nuevas</span>
          <strong>{count("open")}</strong>
        </article>
        <article className="stat-card tone-pending">
          <span>Documentación pedida</span>
          <strong>{count("docs_requested")}</strong>
        </article>
        <article className="stat-card tone-scheduled">
          <span>Por evaluar</span>
          <strong>{count("docs_sent")}</strong>
        </article>
        <article className="stat-card tone-done">
          <span>Evaluadas</span>
          <strong>{count("evaluated")}</strong>
        </article>
      </div>
      <div className="filters">
        <Segmented
          value={scope}
          onChange={(value) => setScope(value as Scope)}
          options={[
            { label: "Abiertas", value: "open" },
            { label: "Cerradas", value: "closed" },
            { label: "Todas", value: "all" },
          ]}
        />
        <Select
          allowClear
          className="filter-select-wide"
          placeholder="Deportista"
          value={athleteId}
          onChange={setAthleteId}
          options={people.map((athlete) => ({ value: athlete.id, label: athleteName(athlete) }))}
        />
      </div>
      {rows.length === 0 ? (
        <div className="day-plan">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No hay incidencias en esta vista." />
        </div>
      ) : (
        <div className="incident-list">
          {rows.map((incident) => {
            const athlete = athletes.find((item) => item.id === incident.athleteId);
            const unseen = panel === "coach" && !incident.coachSeen;
            return (
              <Link key={incident.id} to={`/app/incidencias/${incident.id}`} className={unseen ? "incident-card unseen" : "incident-card"}>
                <div className="incident-card-head">
                  <b>{incident.title}</b>
                  <Tag color={incidentStatusColor[incident.status]}>{incidentStatusLabel[incident.status]}</Tag>
                </div>
                <span>
                  {athlete ? athleteName(athlete) : "Deportista"} · {athlete?.sport} · {formatShort(incident.createdAt)}
                </span>
                <p>{incident.detail}</p>
                <div className="incident-tags">
                  <Tag>{incident.kind === "discomfort" ? "Molestia física" : "Rutina incompleta"}</Tag>
                  {panel === "coach" && incident.kind === "discomfort" && !incident.sharedWithMedical && (
                    <Tag color="purple">Sin autorización médica</Tag>
                  )}
                  {unseen && <Tag color="red">Sin leer</Tag>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
