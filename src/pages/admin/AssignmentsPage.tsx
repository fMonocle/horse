import { App, Card, Select, Table, Tag } from "antd";
import { useAdmin } from "../../admin-store";
import { athleteName, athletes } from "../../data/athletes";
import { cellLabel } from "../../finance";

export function AssignmentsPage() {
  const { assignments, users, roles, subscriptions, plans, setCoach, setProfessionals } = useAdmin();
  const { message } = App.useApp();
  const available = users.filter((user) => user.status === "active" || user.status === "invited");
  const coaches = available.filter((user) => user.roleId === "coach");
  const professionals = available.filter((user) => !["owner", "coach", "athlete"].includes(user.roleId));
  const roleName = (id: string) => roles.find((role) => role.id === id)?.name ?? id;
  const userName = (id: string | null) => users.find((user) => user.id === id)?.name ?? "Sin asignar";

  const rows = assignments.map((item) => {
    const athlete = athletes.find((row) => row.id === item.athleteId)!;
    const user = users.find((row) => row.athleteId === item.athleteId);
    const subscription = subscriptions.find((row) => row.userId === user?.id && row.status !== "cancelled");
    return { ...item, athlete, plan: plans.find((plan) => plan.id === subscription?.planId) };
  });

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Asignaciones</h1>
          <p>Quién entrena a cada deportista y qué profesionales lo acompañan.</p>
        </div>
      </div>
      <div className="stat-grid">
        <article className="stat-card tone-athletes">
          <span>Deportistas</span>
          <strong>{assignments.length}</strong>
        </article>
        <article className="stat-card tone-alert">
          <span>Sin entrenador</span>
          <strong>{assignments.filter((item) => !item.coachId).length}</strong>
        </article>
        <article className="stat-card tone-scheduled">
          <span>Entrenadores</span>
          <strong>{coaches.length}</strong>
        </article>
        <article className="stat-card tone-done">
          <span>Profesionales</span>
          <strong>{professionals.length}</strong>
        </article>
      </div>
      <div className="assign-layout">
        <Table
          className="stack-table"
          rowKey="athleteId"
          dataSource={rows}
          pagination={false}
          scroll={{ x: true }}
          columns={[
            {
              title: "Deportista",
              onCell: () => cellLabel("Deportista"),
              render: (_, row) => (
                <div>
                  <b>{athleteName(row.athlete)}</b>
                  <div style={{ color: "#5C6570", fontSize: 12 }}>
                    {row.athlete.sport}
                    {row.plan ? ` · Plan ${row.plan.name}` : ""}
                  </div>
                </div>
              ),
            },
            {
              title: "Entrenador",
              onCell: () => cellLabel("Entrenador"),
              render: (_, row) => (
                <Select
                  allowClear
                  placeholder="Sin asignar"
                  style={{ width: "100%", minWidth: 180 }}
                  value={row.coachId ?? undefined}
                  options={coaches.map((user) => ({ value: user.id, label: user.status === "invited" ? `${user.name} (invitado)` : user.name }))}
                  onChange={(value?: string) => {
                    setCoach(row.athleteId, value ?? null);
                    message.success(`${athleteName(row.athlete)} queda con ${userName(value ?? null)}.`);
                  }}
                />
              ),
            },
            {
              title: "Profesionales",
              onCell: () => cellLabel("Profesionales"),
              render: (_, row) => (
                <Select
                  mode="multiple"
                  placeholder="Médico, kinesiología…"
                  style={{ width: "100%", minWidth: 240 }}
                  value={row.professionalIds}
                  options={professionals.map((user) => ({ value: user.id, label: `${user.name} · ${roleName(user.roleId)}` }))}
                  onChange={(value: string[]) => {
                    setProfessionals(row.athleteId, value);
                    message.success(`Equipo de ${athleteName(row.athlete)} actualizado.`);
                  }}
                />
              ),
            },
          ]}
        />
        <Card title="Carga por entrenador">
          <div className="mini-list">
            {coaches.map((coach) => {
              const count = assignments.filter((item) => item.coachId === coach.id).length;
              return (
                <div key={coach.id} className="routine-row">
                  <div>
                    <b>{coach.name}</b>
                    <span>{coach.status === "invited" ? "Invitación pendiente" : "Activo"}</span>
                  </div>
                  <Tag color={count > 0 ? "blue" : "default"}>{count} {count === 1 ? "deportista" : "deportistas"}</Tag>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
