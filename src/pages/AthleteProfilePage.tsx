import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Empty, Table, Tag } from "antd";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AssignRoutineModal } from "../components/AssignRoutineModal";
import { HistoryTimeline } from "../components/HistoryTimeline";
import { sortHistory, useFollowup } from "../followup-store";
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
  const { routines, history: timeline } = useFollowup();
  const navigate = useNavigate();
  const [assigning, setAssigning] = useState(false);

  if (!athlete) {
    return (
      <div className="page">
        <p>No encontramos ese deportista.</p>
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
  const athleteRoutines = routines
    .filter((routine) => routine.athleteId === athlete.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const events = sortHistory(timeline.filter((event) => event.athleteId === athlete.id));

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
        <div className="title-actions">
          <Tag color="blue">{statusLabel[athlete.status]}</Tag>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAssigning(true)}>
            Asignar rutina
          </Button>
        </div>
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
        <div className="chart-box" style={{ height: 260 }}>
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
      <div className="two-col" style={{ marginTop: 14 }}>
        <Card title="Rutinas asignadas">
          {athleteRoutines.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Todavía no tiene rutinas asignadas." />
          ) : (
            <div className="mini-list">
              {athleteRoutines.map((routine) => (
                <div key={routine.id} className="routine-row">
                  <div>
                    <b>{routine.title}</b>
                    <span>
                      {formatShort(routine.date)} · {routine.exercises.length} ejercicios
                      {routine.sourceName ? ` · ${routine.sourceName}` : ""}
                    </span>
                  </div>
                  <div className="row-actions">
                    <Tag color={routine.status === "reported" ? "green" : "blue"}>
                      {routine.status === "reported" ? "Informada" : "Asignada"}
                    </Tag>
                    <Button size="small" onClick={() => navigate(`/app/rutinas/${routine.id}`)}>
                      Comparar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card title="Historial" extra={<Button type="link" onClick={() => navigate("/app/incidencias")}>Incidencias</Button>}>
          <HistoryTimeline events={events.slice(0, 8)} linkIncidents />
        </Card>
      </div>
      <Card title="Últimas mediciones" style={{ marginTop: 14 }}>
        <Table
          rowKey="date"
          pagination={false}
          scroll={{ x: true }}
          dataSource={[...measurements.filter((item) => item.athleteId === athlete.id)].reverse()}
          columns={[
            { title: "Fecha", dataIndex: "date", render: (value: string) => formatShort(value) },
            { title: athlete.metric, dataIndex: "value", render: (value: number) => `${value} ${athlete.unit}` },
          ]}
        />
      </Card>
      <AssignRoutineModal open={assigning} onClose={() => setAssigning(false)} defaultAthleteId={athlete.id} />
    </div>
  );
}
