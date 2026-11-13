import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Table, Tag } from "antd";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addDays, formatShort, startOfWeek, toIso, weekdayShort } from "../dates";
import { athleteName, athletes } from "../data/athletes";
import { useTraining } from "../store";

export function DashboardPage() {
  const { sessions } = useTraining();
  const navigate = useNavigate();
  const monday = startOfWeek(new Date());
  const start = toIso(monday);
  const end = toIso(addDays(monday, 6));
  const today = toIso(new Date());

  const week = useMemo(
    () => sessions.filter((session) => session.date >= start && session.date <= end),
    [end, sessions, start],
  );
  const completed = week.filter((session) => session.completed).length;
  const pending = week.filter((session) => !session.completed).length;

  const chart = Array.from({ length: 7 }, (_, index) => {
    const date = toIso(addDays(monday, index));
    const daySessions = week.filter((session) => session.date === date);
    const done = daySessions.filter((session) => session.completed).length;
    const percent = daySessions.length === 0 ? 0 : Math.round((done / daySessions.length) * 100);
    return { day: weekdayShort(date), percent };
  });

  const latest = [...sessions]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 6)
    .map((session) => {
      const athlete = athletes.find((item) => item.id === session.athleteId);
      return {
        ...session,
        athlete: athlete ? athleteName(athlete) : "Deportista",
        athleteId: session.athleteId,
      };
    });

  return (
    <div className="page">
      <div className="demo-banner">
        Demostración comercial. Los deportistas y las mediciones son ficticios.
      </div>
      <div className="page-title">
        <div>
          <h1>Panel de entrenador</h1>
          <p>Semana del {formatShort(start)} al {formatShort(end)}.</p>
        </div>
      </div>
      <div className="stat-grid">
        <article className="stat-card tone-athletes">
          <span>Deportistas</span>
          <strong>{athletes.length}</strong>
        </article>
        <article className="stat-card tone-scheduled">
          <span>Programados esta semana</span>
          <strong>{week.length}</strong>
        </article>
        <article className="stat-card tone-done">
          <span>Completados</span>
          <strong>{completed}</strong>
        </article>
        <article className="stat-card tone-pending">
          <span>Pendientes</span>
          <strong>{pending}</strong>
        </article>
      </div>
      <div className="two-col">
        <Card title="Cumplimiento de la semana">
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid stroke="#E6E8EE" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip formatter={(value) => [`${value}%`, "Cumplimiento"]} />
                <Bar dataKey="percent" fill="#2F6BFF" radius={[6, 6, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Accesos">
          <div style={{ display: "grid", gap: 10 }}>
            <Button block icon={<ArrowRightOutlined />} onClick={() => navigate("/app/deportistas")}>
              Ver deportistas
            </Button>
            <Button block onClick={() => navigate("/app/planificacion")}>
              Abrir planificación
            </Button>
            <Button block onClick={() => navigate("/app/seguimiento")}>
              Ver seguimiento
            </Button>
          </div>
          <p style={{ color: "#5C6570", marginTop: 18, marginBottom: 0 }}>
            Hoy es {formatShort(today)}. Lo que todavía no se marcó como hecho queda pendiente.
          </p>
        </Card>
      </div>
      <Card title="Últimos movimientos" style={{ marginTop: 14 }}>
        <Table
          rowKey="id"
          pagination={false}
          dataSource={latest}
          onRow={(row) => ({
            onClick: () => navigate(`/app/deportistas/${row.athleteId}`),
            style: { cursor: "pointer" },
          })}
          columns={[
            { title: "Deportista", dataIndex: "athlete" },
            { title: "Sesión", dataIndex: "type" },
            { title: "Fecha", dataIndex: "date", render: (value: string) => formatShort(value) },
            {
              title: "Estado",
              dataIndex: "completed",
              render: (done: boolean) => (
                <Tag color={done ? "blue" : "default"}>{done ? "Hecho" : "Pendiente"}</Tag>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
