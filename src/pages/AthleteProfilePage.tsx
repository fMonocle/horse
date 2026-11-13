import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Table, Tag } from "antd";
import { Link, useParams } from "react-router-dom";
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
import { athleteName, athletes, statusLabel } from "../data/athletes";
import { measurements } from "../data/seed";
import { useTraining } from "../store";

export function AthleteProfilePage() {
  const { id } = useParams();
  const athlete = athletes.find((item) => item.id === id);
  const { sessions } = useTraining();

  if (!athlete) {
    return (
      <div className="page">
        <p>Ese deportista no está en la demostración.</p>
        <Link to="/app/deportistas">Volver al listado</Link>
      </div>
    );
  }

  const monday = startOfWeek(new Date());
  const start = toIso(monday);
  const end = toIso(addDays(monday, 6));
  const week = sessions
    .filter((session) => session.athleteId === athlete.id && session.date >= start && session.date <= end)
    .sort((a, b) => a.date.localeCompare(b.date));
  const chart = measurements
    .filter((item) => item.athleteId === athlete.id)
    .map((item) => ({ date: formatShort(item.date), value: item.value }));

  return (
    <div className="page">
      <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => history.back()} style={{ marginBottom: 8 }}>
        Volver
      </Button>
      <div className="page-title">
        <div>
          <h1>{athleteName(athlete)}</h1>
          <p>
            {athlete.sport} · {athlete.country}
          </p>
        </div>
        <Tag color="blue">{statusLabel[athlete.status]}</Tag>
      </div>
      <div className="two-col">
        <Card title="Información">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Objetivo">{athlete.goal}</Descriptions.Item>
            <Descriptions.Item label="Observación del entrenador">{athlete.coachNote}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card title="Esta semana">
          {week.length === 0 ? (
            <p>No hay sesiones esta semana.</p>
          ) : (
            week.map((session) => (
              <div key={session.id} style={{ marginBottom: 10 }}>
                <b>
                  {formatShort(session.date)} · {session.type}
                </b>
                <div style={{ color: "#5C6570" }}>
                  {session.durationMin} min · {session.completed ? "Hecho" : "Pendiente"}
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
      <Card title={`${athlete.metric} (${athlete.unit})`} style={{ marginTop: 14 }}>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart}>
              <CartesianGrid stroke="#E6E8EE" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} unit={` ${athlete.unit}`} width={80} />
              <Tooltip formatter={(value) => [`${value} ${athlete.unit}`, athlete.metric]} />
              <Line type="monotone" dataKey="value" stroke="#2F6BFF" strokeWidth={2.4} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card title="Últimas mediciones" style={{ marginTop: 14 }}>
        <Table
          rowKey="date"
          pagination={false}
          dataSource={[...measurements.filter((item) => item.athleteId === athlete.id)].reverse()}
          columns={[
            { title: "Fecha", dataIndex: "date", render: (value: string) => formatShort(value) },
            { title: athlete.metric, dataIndex: "value", render: (value: number) => `${value} ${athlete.unit}` },
          ]}
        />
      </Card>
    </div>
  );
}
