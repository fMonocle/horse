import { PaperClipOutlined, UploadOutlined } from "@ant-design/icons";
import { App, Button, Card, Empty, Tag, Upload } from "antd";
import { useVisibleIncidents } from "../access";
import { HistoryTimeline } from "../components/HistoryTimeline";
import { formatShort } from "../dates";
import { athleteName, athletes, DEMO_ATHLETE_ID } from "../data/athletes";
import { fitnessColor, fitnessLabel, incidentStatusColor, incidentStatusLabel } from "../data/followup";
import { sortHistory, useFollowup } from "../followup-store";

export function AthleteHistoryPage() {
  const { message } = App.useApp();
  const { history, sendDocs, shareWithMedical } = useFollowup();
  const incidents = [...useVisibleIncidents()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const athlete = athletes.find((item) => item.id === DEMO_ATHLETE_ID)!;
  const name = athleteName(athlete);
  const requests = incidents.filter((incident) => incident.status === "docs_requested");
  const events = sortHistory(history.filter((event) => event.athleteId === DEMO_ATHLETE_ID));

  return (
    <div className="page narrow-page">
      <div className="page-title">
        <div>
          <h1>Mi historial</h1>
          <p>Tus rutinas, molestias, estudios y evaluaciones.</p>
        </div>
      </div>

      {requests.map((incident) => (
        <Card key={incident.id} className="request-card" style={{ marginBottom: 14 }}>
          <Tag color="gold">Tu entrenador te pidió documentación</Tag>
          <h2>{incident.title}</h2>
          <p>{incident.docRequest?.note}</p>
          <Upload
            accept=".pdf,.jpg,.jpeg,.png"
            showUploadList={false}
            beforeUpload={(file) => {
              sendDocs(incident.id, file.name, name);
              message.success("Enviamos el archivo. El equipo médico ya lo puede ver.");
              return Upload.LIST_IGNORE;
            }}
          >
            <Button type="primary" icon={<UploadOutlined />} block>
              Subir estudio o informe
            </Button>
          </Upload>
        </Card>
      ))}

      <Card title="Mis incidencias">
        {incidents.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No reportaste molestias." />
        ) : (
          <div className="mini-list">
            {incidents.map((incident) => (
              <div key={incident.id} className="mini-item">
                <div className="incident-card-head">
                  <b>{incident.title}</b>
                  <Tag color={incidentStatusColor[incident.status]}>{incidentStatusLabel[incident.status]}</Tag>
                </div>
                <span>{formatShort(incident.createdAt)} · {incident.detail}</span>
                {incident.docRequest?.fileName && (
                  <span className="file-chip">
                    <PaperClipOutlined /> {incident.docRequest.fileName}
                  </span>
                )}
                {incident.evaluation && (
                  <div className="info-block">
                    <Tag color={fitnessColor[incident.evaluation.fitness]} style={{ alignSelf: "flex-start" }}>
                      {fitnessLabel[incident.evaluation.fitness]}
                    </Tag>
                    <span>{incident.evaluation.recommendation}</span>
                  </div>
                )}
                {incident.kind === "discomfort" && !incident.sharedWithMedical && incident.status !== "closed" && (
                  <Button
                    size="small"
                    onClick={() => {
                      shareWithMedical(incident.id, name);
                      message.success("El equipo médico ya puede ver esta incidencia.");
                    }}
                  >
                    Compartir con el equipo médico
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Historial" style={{ marginTop: 14 }}>
        <HistoryTimeline events={events} />
      </Card>
    </div>
  );
}
