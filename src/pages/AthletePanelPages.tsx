import { Card, Tag } from "antd";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addDays, formatShort, startOfWeek, toIso } from "../dates";
import { athleteName, athletes, DEMO_ATHLETE_ID } from "../data/athletes";
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

  return (
    <div className="page">
      <div className="demo-banner">
        Así vería su semana {athleteName(athlete)}. En la reunión se cambia desde el encabezado.
      </div>
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
        <div style={{ height: 300 }}>
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
