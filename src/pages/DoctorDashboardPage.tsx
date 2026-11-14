import { Card, Empty, Tag } from "antd";
import { Link } from "react-router-dom";
import { useVisibleIncidents } from "../access";
import { useAdmin, useUserName } from "../admin-store";
import { formatShort } from "../dates";
import { athleteName, athletes } from "../data/athletes";
import { fitnessColor, fitnessLabel, incidentStatusColor, incidentStatusLabel } from "../data/followup";
import { PERSONA_USER } from "../data/platform";

export function DoctorDashboardPage() {
  const { assignments } = useAdmin();
  const userName = useUserName();
  const incidents = useVisibleIncidents();
  const mine = assignments.filter((item) => item.professionalIds.includes(PERSONA_USER.doctor));
  const toReview = incidents
    .filter((incident) => incident.status === "docs_sent" || incident.status === "open")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const waiting = incidents.filter((incident) => incident.status === "docs_requested");
  const evaluated = incidents.filter((incident) => incident.evaluation);

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Panel médico</h1>
          <p>Deportistas a cargo e incidencias que autorizaron a compartir.</p>
        </div>
      </div>
      <div className="stat-grid">
        <article className="stat-card tone-alert">
          <span>Por evaluar</span>
          <strong>{toReview.length}</strong>
        </article>
        <article className="stat-card tone-pending">
          <span>Esperando documentación</span>
          <strong>{waiting.length}</strong>
        </article>
        <article className="stat-card tone-done">
          <span>Evaluaciones registradas</span>
          <strong>{evaluated.length}</strong>
        </article>
        <article className="stat-card tone-athletes">
          <span>Deportistas a cargo</span>
          <strong>{mine.length}</strong>
        </article>
      </div>
      <div className="two-col">
        <Card title="Para evaluar">
          {toReview.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No hay incidencias para evaluar." />
          ) : (
            <div className="mini-list">
              {toReview.map((incident) => {
                const athlete = athletes.find((item) => item.id === incident.athleteId);
                return (
                  <Link key={incident.id} to={`/app/incidencias/${incident.id}`} className="mini-item link-item">
                    <div className="incident-card-head">
                      <b>{incident.title}</b>
                      <Tag color={incidentStatusColor[incident.status]}>{incidentStatusLabel[incident.status]}</Tag>
                    </div>
                    <span>
                      {athlete ? athleteName(athlete) : "Deportista"} · {formatShort(incident.createdAt)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </Card>
        <Card title="Deportistas a cargo">
          <div className="mini-list">
            {mine.map((item) => {
              const athlete = athletes.find((row) => row.id === item.athleteId);
              const last = incidents
                .filter((incident) => incident.athleteId === item.athleteId && incident.evaluation)
                .sort((a, b) => b.evaluation!.date.localeCompare(a.evaluation!.date))[0];
              return (
                <div key={item.athleteId} className="mini-item">
                  <div className="incident-card-head">
                    <b>{athlete ? athleteName(athlete) : item.athleteId}</b>
                    {last?.evaluation ? (
                      <Tag color={fitnessColor[last.evaluation.fitness]}>{fitnessLabel[last.evaluation.fitness]}</Tag>
                    ) : (
                      <Tag>Sin evaluaciones</Tag>
                    )}
                  </div>
                  <span>
                    {athlete?.sport} · Entrenador: {userName(item.coachId)}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
