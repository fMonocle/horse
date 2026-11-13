import { Card, Select, Table } from "antd";
import { useMemo, useState } from "react";
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
import { athleteName, athletes } from "../data/athletes";
import { measurements } from "../data/seed";
import { useTraining } from "../store";

export function TrackingPage() {
  const { sessions } = useTraining();
  const [athleteId, setAthleteId] = useState(athletes[0].id);
  const [weeks, setWeeks] = useState(8);
  const athlete = athletes.find((item) => item.id === athleteId) ?? athletes[0];
  const from = toIso(addDays(startOfWeek(new Date()), -7 * (weeks - 1)));

  const chart = useMemo(
    () =>
      measurements
        .filter((item) => item.athleteId === athlete.id && item.date >= from)
        .map((item) => ({ date: formatShort(item.date), value: item.value })),
    [athlete.id, from],
  );

  const history = sessions
    .filter((session) => session.athleteId === athlete.id && session.date >= from)
    .sort((a, b) => b.date.localeCompare(a.date));
  const done = history.filter((session) => session.completed).length;
  const percent = history.length === 0 ? 0 : Math.round((done / history.length) * 100);

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Seguimiento</h1>
          <p>La unidad de cada gráfico es la de esa disciplina. No hay puntajes médicos.</p>
        </div>
      </div>
      <div className="filters">
        <Select
          value={athleteId}
          style={{ width: 260 }}
          options={athletes.map((item) => ({ value: item.id, label: athleteName(item) }))}
          onChange={setAthleteId}
        />
        <Select
          value={weeks}
          style={{ width: 180 }}
          options={[
            { value: 4, label: "Últimas 4 semanas" },
            { value: 8, label: "Últimas 8 semanas" },
          ]}
          onChange={setWeeks}
        />
      </div>
      <div className="stat-grid">
        <article className="stat-card">
          <span>Cumplimiento del período</span>
          <strong>{percent}%</strong>
        </article>
        <article className="stat-card">
          <span>Sesiones del período</span>
          <strong>{history.length}</strong>
        </article>
        <article className="stat-card">
          <span>Hechas</span>
          <strong>{done}</strong>
        </article>
        <article className="stat-card">
          <span>{athlete.metric}</span>
          <strong style={{ fontSize: 22 }}>{athlete.unit}</strong>
        </article>
      </div>
      <Card title={`${athlete.metric} · ${athlete.unit}`}>
        <div style={{ height: 280 }}>
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
      <div className="two-col" style={{ marginTop: 14 }}>
        <Card title="Registro de entrenamientos">
          <Table
            rowKey="id"
            pagination={{ pageSize: 6, hideOnSinglePage: true }}
            dataSource={history}
            columns={[
              { title: "Fecha", dataIndex: "date", render: (value: string) => formatShort(value) },
              { title: "Tipo", dataIndex: "type" },
              { title: "Duración", dataIndex: "durationMin", render: (value: number) => `${value} min` },
              { title: "Estado", dataIndex: "completed", render: (doneRow: boolean) => (doneRow ? "Hecho" : "Pendiente") },
            ]}
          />
        </Card>
        <Card title="Observación del entrenador">
          <p style={{ marginTop: 0 }}>{athlete.coachNote}</p>
          <p style={{ color: "#5C6570" }}>{athlete.goal}</p>
        </Card>
      </div>
    </div>
  );
}
