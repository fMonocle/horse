import {
  ArrowLeftOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Alert, App, Button, Card, DatePicker, Form, Input, Modal, Radio, Steps, Tag } from "antd";
import type { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useVisibleIncidents } from "../access";
import { useUserName } from "../admin-store";
import { useAuth } from "../auth";
import { HistoryTimeline } from "../components/HistoryTimeline";
import { formatLong, formatShort } from "../dates";
import { athleteName, athletes } from "../data/athletes";
import {
  feelingLabel,
  fitnessColor,
  fitnessLabel,
  incidentStatusColor,
  incidentStatusLabel,
} from "../data/followup";
import { PERSONA_USER } from "../data/platform";
import { sortHistory, useFollowup } from "../followup-store";
import type { Fitness, Incident } from "../types";

const stepIndex: Record<Incident["status"], number> = {
  open: 0,
  docs_requested: 1,
  docs_sent: 2,
  evaluated: 3,
  closed: 4,
};

type EvaluationValues = {
  diagnosis: string;
  recommendation: string;
  fitness: Fitness;
  returnDate?: Dayjs;
};

export function IncidentDetailPage() {
  const { id } = useParams();
  const { panel } = useAuth();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const visible = useVisibleIncidents();
  const { reports, routines, history, incidents, markSeen, requestDocs, closeIncident, evaluate } = useFollowup();
  const userName = useUserName();
  const [action, setAction] = useState<"docs" | "close" | null>(null);
  const [note, setNote] = useState("");
  const [form] = Form.useForm<EvaluationValues>();
  const incident = visible.find((item) => item.id === id);

  useEffect(() => {
    if (incident && panel === "coach" && !incident.coachSeen) markSeen(incident.id);
  }, [incident, markSeen, panel]);

  const events = useMemo(() => {
    if (!incident) return [];
    const rows = history.filter((event) => event.athleteId === incident.athleteId);
    if (panel === "doctor") {
      const shared = new Set(incidents.filter((item) => item.sharedWithMedical).map((item) => item.id));
      return sortHistory(rows.filter((event) => event.incidentId && shared.has(event.incidentId)));
    }
    return sortHistory(rows);
  }, [history, incident, incidents, panel]);

  if (!incident) {
    return (
      <div className="page">
        <p>No encontramos esa incidencia o no tenés acceso.</p>
        <Link to="/app/incidencias">Volver a incidencias</Link>
      </div>
    );
  }

  const athlete = athletes.find((item) => item.id === incident.athleteId);
  const report = reports.find((item) => item.id === incident.reportId);
  const routine = routines.find((item) => item.id === report?.assignmentId);
  const actor = userName(PERSONA_USER[panel]);
  const open = incident.status !== "closed";
  const canEvaluate = panel === "doctor" && open && incident.status !== "evaluated";

  function confirmAction() {
    if (!incident) return;
    if (action === "docs") {
      requestDocs(incident.id, note.trim(), actor);
      message.success("Le pedimos la documentación al deportista.");
    } else if (action === "close") {
      closeIncident(incident.id, note.trim(), actor);
      message.success("Incidencia cerrada.");
    }
    setAction(null);
    setNote("");
  }

  function saveEvaluation(values: EvaluationValues) {
    if (!incident) return;
    evaluate(
      incident.id,
      {
        doctorId: PERSONA_USER.doctor,
        date: new Date().toISOString().slice(0, 10),
        diagnosis: values.diagnosis.trim(),
        recommendation: values.recommendation.trim(),
        fitness: values.fitness,
        returnDate: values.returnDate?.format("YYYY-MM-DD"),
      },
      actor,
    );
    message.success("Evaluación registrada. El entrenador recibe el aviso.");
  }

  return (
    <div className="page">
      <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate("/app/incidencias")} style={{ marginBottom: 8 }}>
        Incidencias
      </Button>
      <div className="page-title">
        <div>
          <h1>{incident.title}</h1>
          <p>
            {athlete ? athleteName(athlete) : "Deportista"} · {athlete?.sport} · {formatLong(incident.createdAt)}
          </p>
        </div>
        <Tag color={incidentStatusColor[incident.status]}>{incidentStatusLabel[incident.status]}</Tag>
      </div>

      <Card className="steps-card">
        <Steps
          size="small"
          responsive
          current={stepIndex[incident.status]}
          status={incident.status === "closed" ? "finish" : "process"}
          items={[
            { title: "Reportada" },
            { title: "Documentación" },
            { title: "Evaluación médica" },
            { title: "Seguimiento" },
            { title: "Cerrada" },
          ]}
        />
      </Card>

      <div className="two-col" style={{ marginTop: 14 }}>
        <Card title={routine ? `Lo que informó · ${routine.title}` : "Lo que informó"}>
          <p style={{ marginTop: 0 }}>{incident.detail}</p>
          {report && routine && (
            <>
              <ul className="result-list">
                {routine.exercises.map((exercise) => {
                  const result = report.results.find((item) => item.exerciseId === exercise.id);
                  return (
                    <li key={exercise.id}>
                      {result?.done ? (
                        <CheckCircleFilled style={{ color: "#2f6b45" }} />
                      ) : (
                        <CloseCircleFilled style={{ color: "#c2410c" }} />
                      )}
                      <div>
                        <b>{exercise.name}</b>
                        <span>
                          {exercise.prescription}
                          {result?.result ? ` · ${result.result}` : ""}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="report-facts">
                <span>
                  Cómo se sintió <b>{feelingLabel[report.feeling]}</b>
                </span>
                <span>
                  Esfuerzo <b>{report.effort} de 10</b>
                </span>
                {report.discomfort && (
                  <span>
                    Molestia <b>{report.discomfort.zone} · {report.discomfort.intensity} de 10</b>
                  </span>
                )}
              </div>
              {report.comment && <p className="plan-note">«{report.comment}»</p>}
            </>
          )}
        </Card>

        <Card title={panel === "doctor" ? "Evaluación médica" : "Acciones"}>
          {panel === "coach" && incident.kind === "discomfort" && !incident.sharedWithMedical && (
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 12 }}
              message="El deportista no compartió esta incidencia con el equipo médico. Puede autorizarlo desde su historial."
            />
          )}
          {incident.docRequest && (
            <div className="info-block">
              <b>Documentación médica</b>
              <span>
                Pedida el {formatShort(incident.docRequest.requestedAt)}. {incident.docRequest.note}
              </span>
              {incident.docRequest.fileName ? (
                <span className="file-chip">
                  <PaperClipOutlined /> {incident.docRequest.fileName} · enviada el {formatShort(incident.docRequest.sentAt!)}
                </span>
              ) : (
                <Tag color="gold">Esperando al deportista</Tag>
              )}
            </div>
          )}
          {incident.evaluation && (
            <div className="info-block">
              <b>
                Evaluación de {userName(incident.evaluation.doctorId)} · {formatShort(incident.evaluation.date)}
              </b>
              <Tag color={fitnessColor[incident.evaluation.fitness]} style={{ alignSelf: "flex-start" }}>
                {fitnessLabel[incident.evaluation.fitness]}
              </Tag>
              <span>{incident.evaluation.diagnosis}</span>
              <span>{incident.evaluation.recommendation}</span>
              {incident.evaluation.returnDate && <span>Vuelta a la carga completa: {formatShort(incident.evaluation.returnDate)}</span>}
            </div>
          )}
          {incident.closedNote && (
            <div className="info-block">
              <b>Cierre</b>
              <span>{incident.closedNote}</span>
            </div>
          )}

          {panel === "coach" && open && (
            <div className="action-stack">
              {incident.kind === "discomfort" && incident.status === "open" && (
                <Button type="primary" block onClick={() => setAction("docs")}>
                  Solicitar documentación médica
                </Button>
              )}
              <Button block onClick={() => setAction("close")}>
                Cerrar incidencia
              </Button>
            </div>
          )}

          {canEvaluate && (
            <Form form={form} layout="vertical" onFinish={saveEvaluation} initialValues={{ fitness: "restricted" }}>
              <Form.Item name="diagnosis" label="Diagnóstico" rules={[{ required: true, message: "Completá el diagnóstico" }]}>
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item name="recommendation" label="Indicaciones" rules={[{ required: true, message: "Completá las indicaciones" }]}>
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item name="fitness" label="Aptitud">
                <Radio.Group
                  optionType="button"
                  options={(Object.keys(fitnessLabel) as Fitness[]).map((key) => ({ value: key, label: fitnessLabel[key] }))}
                />
              </Form.Item>
              <Form.Item name="returnDate" label="Vuelta a la carga completa">
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
              <Button type="primary" htmlType="submit" block>
                Registrar evaluación
              </Button>
            </Form>
          )}

          {!incident.docRequest && !incident.evaluation && !(panel === "coach" && open) && !canEvaluate && (
            <p style={{ margin: 0, color: "#5c6570" }}>Sin novedades.</p>
          )}
        </Card>
      </div>

      <Card title="Historial del deportista" style={{ marginTop: 14 }}>
        <HistoryTimeline events={events} linkIncidents />
      </Card>

      <Modal
        title={action === "docs" ? "Solicitar documentación médica" : "Cerrar incidencia"}
        open={action !== null}
        onCancel={() => setAction(null)}
        onOk={confirmAction}
        okText={action === "docs" ? "Enviar pedido" : "Cerrar incidencia"}
        cancelText="Cancelar"
      >
        <p style={{ color: "#5c6570" }}>
          {action === "docs"
            ? "El deportista ve el pedido en su historial y puede subir el archivo desde el teléfono."
            : "Queda registrado en el historial del deportista."}
        </p>
        <Input.TextArea
          rows={3}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder={action === "docs" ? "Qué estudio necesitás" : "Cómo se resolvió"}
        />
      </Modal>
    </div>
  );
}
