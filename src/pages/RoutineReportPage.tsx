import { ArrowLeftOutlined, CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { App, Button, Card, Checkbox, Input, Rate, Select, Slider, Switch, Tag } from "antd";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatLong } from "../dates";
import { athleteName, athletes, DEMO_ATHLETE_ID } from "../data/athletes";
import { discomfortZones, feelingLabel } from "../data/followup";
import { useFollowup } from "../followup-store";

export function RoutineReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  const { routines, reports, submitReport } = useFollowup();
  const routine = routines.find((item) => item.id === id && item.athleteId === DEMO_ATHLETE_ID);
  const report = reports.find((item) => item.assignmentId === id);
  const athlete = athletes.find((item) => item.id === DEMO_ATHLETE_ID)!;

  const initial = useMemo(
    () => Object.fromEntries((routine?.exercises ?? []).map((exercise) => [exercise.id, { done: true, result: "" }])),
    [routine],
  );
  const [results, setResults] = useState<Record<string, { done: boolean; result: string }>>(initial);
  const [feeling, setFeeling] = useState(4);
  const [effort, setEffort] = useState(6);
  const [comment, setComment] = useState("");
  const [hurt, setHurt] = useState(false);
  const [zone, setZone] = useState<string>();
  const [intensity, setIntensity] = useState(4);
  const [description, setDescription] = useState("");
  const [share, setShare] = useState(true);

  if (!routine) {
    return (
      <div className="page">
        <p>No encontramos esa rutina.</p>
        <Link to="/app/mi-semana">Volver a mi semana</Link>
      </div>
    );
  }

  const header = (
    <>
      <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate("/app/mi-semana")} style={{ marginBottom: 8 }}>
        Mi semana
      </Button>
      <div className="page-title">
        <div>
          <h1>{routine.title}</h1>
          <p>{formatLong(routine.date)}</p>
        </div>
        {report && <Tag color="green">Informada</Tag>}
      </div>
      {routine.note && <p className="plan-note" style={{ marginTop: 0, marginBottom: 14 }}>{routine.note}</p>}
    </>
  );

  if (report) {
    return (
      <div className="page narrow-page">
        {header}
        <Card title="Lo que informaste">
          <ul className="result-list">
            {routine.exercises.map((exercise) => {
              const result = report.results.find((item) => item.exerciseId === exercise.id);
              return (
                <li key={exercise.id}>
                  {result?.done ? <CheckCircleFilled style={{ color: "#2f6b45" }} /> : <CloseCircleFilled style={{ color: "#c2410c" }} />}
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
              Cómo te sentiste <b>{feelingLabel[report.feeling]}</b>
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
          <Button block style={{ marginTop: 14 }} onClick={() => navigate("/app/mi-historial")}>
            Ver mi historial
          </Button>
        </Card>
      </div>
    );
  }

  const currentRoutine = routine;

  function send() {
    if (hurt && !zone) {
      message.warning("Elegí dónde sentiste la molestia.");
      return;
    }
    const incident = submitReport(
      currentRoutine.id,
      {
        results: currentRoutine.exercises.map((exercise) => ({ exerciseId: exercise.id, ...results[exercise.id] })),
        feeling,
        effort,
        comment: comment.trim(),
        discomfort: hurt && zone ? { zone, intensity, description: description.trim() } : undefined,
        shareWithMedical: hurt && share,
      },
      athleteName(athlete),
    );
    message.success(incident ? "Listo. Le avisamos a tu entrenador." : "Listo. Tu entrenador ya lo puede ver.");
    navigate("/app/mi-semana");
  }

  return (
    <div className="page narrow-page">
      {header}
      <Card title="¿Qué hiciste?">
        <div className="report-exercises">
          {routine.exercises.map((exercise) => {
            const value = results[exercise.id] ?? { done: true, result: "" };
            return (
              <div key={exercise.id} className={value.done ? "report-exercise" : "report-exercise missed"}>
                <div className="report-exercise-head">
                  <div>
                    <b>{exercise.name}</b>
                    <span>{exercise.prescription}</span>
                  </div>
                  <Checkbox
                    checked={value.done}
                    onChange={(event) => setResults({ ...results, [exercise.id]: { ...value, done: event.target.checked } })}
                  >
                    Lo hice
                  </Checkbox>
                </div>
                <Input
                  placeholder={value.done ? "Resultado (opcional): series, carga, tiempo" : "¿Por qué no lo hiciste?"}
                  value={value.result}
                  onChange={(event) => setResults({ ...results, [exercise.id]: { ...value, result: event.target.value } })}
                />
              </div>
            );
          })}
        </div>
      </Card>

      <Card title="¿Cómo te sentiste?" style={{ marginTop: 14 }}>
        <div className="feeling-row">
          <Rate value={feeling} onChange={(value) => setFeeling(value || 1)} tooltips={feelingLabel.slice(1)} />
          <b>{feelingLabel[feeling]}</b>
        </div>
        <span className="field-label" style={{ marginTop: 16 }}>
          Esfuerzo percibido: {effort} de 10
        </span>
        <Slider min={1} max={10} value={effort} onChange={setEffort} marks={{ 1: "1", 5: "5", 10: "10" }} />
        <Input.TextArea
          rows={2}
          placeholder="Comentario para tu entrenador (opcional)"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </Card>

      <Card style={{ marginTop: 14 }}>
        <label className="switch-row">
          <span>
            <b>Tuve una molestia física</b>
            <small>Tu entrenador recibe un aviso.</small>
          </span>
          <Switch checked={hurt} onChange={setHurt} />
        </label>
        {hurt && (
          <div className="discomfort-form">
            <span className="field-label">¿Dónde?</span>
            <Select placeholder="Elegí la zona" value={zone} onChange={setZone} options={discomfortZones.map((item) => ({ value: item, label: item }))} style={{ width: "100%" }} />
            <span className="field-label">Intensidad: {intensity} de 10</span>
            <Slider min={1} max={10} value={intensity} onChange={setIntensity} marks={{ 1: "Leve", 10: "Fuerte" }} />
            <Input.TextArea rows={2} placeholder="Contá cuándo apareció y qué movimiento la provoca" value={description} onChange={(event) => setDescription(event.target.value)} />
            <Checkbox checked={share} onChange={(event) => setShare(event.target.checked)}>
              Compartir con el equipo médico
            </Checkbox>
          </div>
        )}
      </Card>

      <Button type="primary" size="large" block style={{ marginTop: 16 }} onClick={send}>
        Enviar a mi entrenador
      </Button>
    </div>
  );
}
