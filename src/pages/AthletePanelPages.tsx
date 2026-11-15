import { Alert, Button, Card, Empty, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { useVisibleIncidents } from "../access";
import { useFollowup } from "../followup-store";
import { fitnessLabel } from "../data/followup";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addDays, formatShort, startOfWeek, todayIso, toIso } from "../dates";
import { athletes, DEMO_ATHLETE_ID } from "../data/athletes";
import { measurements } from "../data/seed";
import { useTraining } from "../store";

function useDemoAthlete() {
  return athletes.find((athlete) => athlete.id === DEMO_ATHLETE_ID) ?? athletes[0];
}

export function AthleteWeekPage() {
  const athlete = useDemoAthlete();
  const { sessions } = useTraining();
  const monday = startOfWeek(new Date());
  const start = toIso(monday);
  const end = toIso(addDays(monday, 6));
  const week = sessions
    .filter((session) => session.athleteId === athlete.id && session.date >= start && session.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date));
  const done = week.filter((session) => session.completed).length;
  const navigate = useNavigate();
  const { routines } = useFollowup();
  const incidents = useVisibleIncidents();
  const requests = incidents.filter((incident) => incident.status === "docs_requested");
  const restriction = incidents.find(
    (incident) => incident.status !== "closed" && incident.evaluation && incident.evaluation.fitness !== "fit",
  );
  const today = todayIso();
  const mine = routines.filter((routine) => routine.athleteId === athlete.id);
  const imported = mine.filter((routine) => routine.planKey).sort((a, b) => a.date.localeCompare(b.date));
  const todayRoutine = mine.find((routine) => routine.date === today);
  const myRoutines = mine
    .filter((routine) => !routine.planKey)
    .sort((a, b) => (a.status === b.status ? a.date.localeCompare(b.date) : a.status === "assigned" ? -1 : 1))
    .slice(0, 4);

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Hola, {athlete.firstName}</h1>
          <p>
            {athlete.sport} · semana del {formatShort(start)} al {formatShort(end)}
          </p>
        </div>
        <Tag color="blue">
          {done} de {week.length} hechas
        </Tag>
      </div>
      {requests.length > 0 && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 14 }}
          message={`Tu entrenador te pidió documentación médica (${requests[0].title.toLowerCase()}).`}
          action={
            <Button size="small" onClick={() => navigate("/app/mi-historial")}>
              Subir
            </Button>
          }
        />
      )}
      {restriction?.evaluation && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 14 }}
          message={`Indicación médica: ${fitnessLabel[restriction.evaluation.fitness].toLowerCase()}`}
          description={restriction.evaluation.recommendation}
        />
      )}
      <Card title={todayRoutine ? "Entrenamiento de hoy" : "Entrenamiento importado"} style={{ marginBottom: 14 }}>
        {todayRoutine ? (
          <div className="routine-row">
            <div>
              <b>{todayRoutine.title}</b>
              <span>{todayRoutine.exercises.length} ejercicios</span>
            </div>
            <Button type="primary" onClick={() => navigate(`/app/mi-rutina/${todayRoutine.id}`)}>
              {todayRoutine.status === "assigned" ? "Empezar" : "Ver"}
            </Button>
          </div>
        ) : (
          <p className="plan-summary">Hoy no hay un entrenamiento cargado.</p>
        )}
        {imported.length > 0 && (
          <div className="mini-list" style={{ marginTop: 12 }}>
            {imported.map((routine) => (
              <div key={routine.id} className="routine-row">
                <div>
                  <b>{routine.weekday ?? routine.title}</b>
                  <span>
                    {formatShort(routine.date)} · {routine.exercises.length} ejercicios
                    {routine.sourceName ? ` · ${routine.sourceName}` : ""}
                  </span>
                </div>
                <Button type={routine.id === todayRoutine?.id ? "default" : "primary"} onClick={() => navigate(`/app/mi-rutina/${routine.id}`)}>
                  {routine.status === "assigned" ? "Informar" : "Ver"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
      <Card title="Rutinas para informar" style={{ marginBottom: 14 }}>
        {myRoutines.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No tenés rutinas asignadas." />
        ) : (
          <div className="mini-list">
            {myRoutines.map((routine) => (
              <div key={routine.id} className="routine-row">
                <div>
                  <b>{routine.title}</b>
                  <span>
                    {formatShort(routine.date)} · {routine.exercises.length} {routine.exercises.length === 1 ? "ejercicio" : "ejercicios"}
                  </span>
                </div>
                {routine.status === "assigned" ? (
                  <Button type="primary" onClick={() => navigate(`/app/mi-rutina/${routine.id}`)}>
                    Informar
                  </Button>
                ) : (
                  <Button onClick={() => navigate(`/app/mi-rutina/${routine.id}`)}>Ver</Button>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
      <div className="two-col">
        <Card title="Tu planificación">
          {week.map((session) => (
            <div key={session.id} style={{ padding: "10px 0", borderBottom: "1px solid #E6E8EE" }}>
              <b>
                {formatShort(session.date)} · {session.type}
              </b>
              <div style={{ color: "#5C6570" }}>
                {session.durationMin} min · {session.completed ? "Hecha" : "Pendiente"}
              </div>
              <div>{session.notes}</div>
            </div>
          ))}
        </Card>
        <Card title="Nota de tu entrenador">
          <p style={{ marginTop: 0 }}>{athlete.coachNote}</p>
          <p style={{ color: "#5C6570" }}>{athlete.goal}</p>
        </Card>
      </div>
    </div>
  );
}

export function AthleteProgressPage() {
  const athlete = useDemoAthlete();
  const chart = measurements
    .filter((item) => item.athleteId === athlete.id)
    .map((item) => ({ date: formatShort(item.date), value: item.value }));

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Mi evolución</h1>
          <p>
            {athlete.metric}, en {athlete.unit}.
          </p>
        </div>
      </div>
      <Card title={`${athlete.metric} (${athlete.unit})`}>
        <div className="chart-box" style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart}>
              <CartesianGrid stroke="#E6E8EE" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} width={72} />
              <Tooltip formatter={(value) => [`${value} ${athlete.unit}`, athlete.metric]} />
              <Line type="monotone" dataKey="value" stroke="#2F6BFF" strokeWidth={2.4} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
