import { Avatar, Button, Input, Select, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addDays, formatShort, startOfWeek, toIso } from "../dates";
import { athleteName, athletes, statusLabel } from "../data/athletes";
import { useTraining } from "../store";
import type { AthleteStatus } from "../types";

const statusColor: Record<AthleteStatus, string> = {
  available: "blue",
  traveling: "gold",
  competition: "green",
};

export function AthletesPage() {
  const navigate = useNavigate();
  const { sessions } = useTraining();
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState<string>();
  const [status, setStatus] = useState<AthleteStatus>();
  const monday = startOfWeek(new Date());
  const start = toIso(monday);
  const end = toIso(addDays(monday, 6));

  const sports = [...new Set(athletes.map((athlete) => athlete.sport))];
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return athletes.filter((athlete) => {
      const name = athleteName(athlete).toLowerCase();
      const matchesText = text.length === 0 || name.includes(text) || athlete.country.toLowerCase().includes(text);
      const matchesSport = !sport || athlete.sport === sport;
      const matchesStatus = !status || athlete.status === status;
      return matchesText && matchesSport && matchesStatus;
    });
  }, [query, sport, status]);

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Deportistas</h1>
          <p>{filtered.length} en esta vista. Los nombres son de la demostración.</p>
        </div>
      </div>
      <div className="filters">
        <Input.Search
          allowClear
          placeholder="Buscar por nombre o país"
          style={{ width: 280 }}
          onChange={(event) => setQuery(event.target.value)}
        />
        <Select
          allowClear
          placeholder="Disciplina"
          style={{ width: 180 }}
          options={sports.map((item) => ({ value: item, label: item }))}
          onChange={setSport}
        />
        <Select
          allowClear
          placeholder="Estado"
          style={{ width: 180 }}
          options={(Object.keys(statusLabel) as AthleteStatus[]).map((item) => ({
            value: item,
            label: statusLabel[item],
          }))}
          onChange={setStatus}
        />
      </div>
      <Table
        rowKey="id"
        dataSource={filtered}
        pagination={false}
        columns={[
          {
            title: "Deportista",
            render: (_, athlete) => (
              <div className="athlete-cell">
                <Avatar style={{ background: "#12151C" }}>
                  {athlete.firstName.slice(0, 1)}
                  {athlete.lastName.slice(0, 1)}
                </Avatar>
                <div>
                  <b>{athleteName(athlete)}</b>
                  <div style={{ color: "#5C6570", fontSize: 12 }}>{athlete.country}</div>
                </div>
              </div>
            ),
          },
          { title: "Disciplina", dataIndex: "sport" },
          {
            title: "Estado",
            dataIndex: "status",
            render: (value: AthleteStatus) => <Tag color={statusColor[value]}>{statusLabel[value]}</Tag>,
          },
          {
            title: "Próximo entrenamiento",
            render: (_, athlete) => {
              const next = sessions
                .filter((session) => session.athleteId === athlete.id && session.date >= start && session.date <= end && !session.completed)
                .sort((a, b) => a.date.localeCompare(b.date))[0];
              return next ? `${formatShort(next.date)} · ${next.type}` : "Sin pendiente esta semana";
            },
          },
          {
            title: "",
            width: 120,
            render: (_, athlete) => (
              <Button type="primary" onClick={() => navigate(`/app/deportistas/${athlete.id}`)}>
                Ver perfil
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
}
