import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Card, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdmin } from "../../admin-store";
import { addDays, formatShort, startOfWeek, toIso, todayIso } from "../../dates";
import { formatMoney, subscriptionStatusColor, subscriptionStatusLabel } from "../../data/platform";
import { currentMonth, monthlySeries, pendingTotal, planDistribution } from "../../finance";
import { useFollowup } from "../../followup-store";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { users, roles, subscriptions, plans, movements, assignments } = useAdmin();
  const { incidents, routines } = useFollowup();
  const month = currentMonth(movements);
  const series = monthlySeries(movements);
  const distribution = planDistribution(subscriptions, plans);
  const active = subscriptions.filter((item) => item.status === "current" || item.status === "pending");
  const upToDate = subscriptions.filter((item) => item.status === "current").length;
  const monday = toIso(startOfWeek(new Date()));
  const sunday = toIso(addDays(startOfWeek(new Date()), 6));
  const limit = toIso(addDays(new Date(), 15));
  const upcoming = subscriptions
    .filter((item) => item.nextDue && item.status !== "cancelled" && item.nextDue <= limit)
    .sort((a, b) => (a.nextDue ?? "").localeCompare(b.nextDue ?? ""))
    .slice(0, 6);
  const userName = (id: string) => users.find((user) => user.id === id)?.name ?? "Usuario";
  const planName = (id: string) => plans.find((plan) => plan.id === id)?.name ?? "Plan";

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Resumen de la plataforma</h1>
          <p>Usuarios, suscripciones, finanzas y operación deportiva en un solo lugar.</p>
        </div>
      </div>
      <div className="stat-grid">
        <article className="stat-card tone-athletes">
          <span>Usuarios activos</span>
          <strong>{users.filter((user) => user.status === "active").length}</strong>
        </article>
        <article className="stat-card tone-done">
          <span>Suscripciones al día</span>
          <strong>
            {upToDate}
            <small> de {active.length}</small>
          </strong>
        </article>
        <article className="stat-card tone-scheduled">
          <span>Ingresos del mes</span>
          <strong>{formatMoney(month.income)}</strong>
        </article>
        <article className="stat-card tone-pending">
          <span>Por cobrar</span>
          <strong>{formatMoney(pendingTotal(movements, "income"))}</strong>
        </article>
      </div>
      <div className="two-col">
        <Card title="Ingresos y egresos" extra={<Button type="link" onClick={() => navigate("/app/admin/finanzas")}>Finanzas</Button>}>
          <div className="chart-box" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid stroke="#E6E8EE" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} width={56} />
                <Tooltip formatter={(value, name) => [formatMoney(Number(value)), name === "income" ? "Ingresos" : "Egresos"]} />
                <Bar dataKey="income" fill="#2F6BFF" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="expense" fill="#C9CFDA" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Distribución por plan" extra={<Button type="link" onClick={() => navigate("/app/admin/planes")}>Planes</Button>}>
          <div className="chart-box" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distribution} dataKey="count" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {distribution.map((row) => (
                    <Cell key={row.id} fill={row.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} ${value === 1 ? "suscripción" : "suscripciones"}`, name]} />
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <div className="two-col" style={{ marginTop: 14 }}>
        <Card title="Próximos vencimientos" extra={<Button type="link" onClick={() => navigate("/app/admin/suscripciones")}>Suscripciones</Button>}>
          <div className="mini-list">
            {upcoming.map((item) => (
              <div key={item.id} className="routine-row">
                <div>
                  <b>{userName(item.userId)}</b>
                  <span>
                    {planName(item.planId)} · {item.nextDue! < todayIso() ? "venció el" : "vence el"} {formatShort(item.nextDue!)}
                  </span>
                </div>
                <Tag color={subscriptionStatusColor[item.status]}>{subscriptionStatusLabel[item.status]}</Tag>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Operación">
          <div className="mini-list">
            <div className="routine-row">
              <div>
                <b>Incidencias abiertas</b>
                <span>Molestias y rutinas sin completar</span>
              </div>
              <strong className="row-number">{incidents.filter((incident) => incident.status !== "closed").length}</strong>
            </div>
            <div className="routine-row">
              <div>
                <b>Rutinas de esta semana</b>
                <span>Asignadas por los entrenadores</span>
              </div>
              <strong className="row-number">{routines.filter((routine) => routine.date >= monday && routine.date <= sunday).length}</strong>
            </div>
            <div className="routine-row">
              <div>
                <b>Deportistas sin entrenador</b>
                <span>Pendientes de asignar</span>
              </div>
              <strong className="row-number">{assignments.filter((item) => !item.coachId).length}</strong>
            </div>
            {roles.map((role) => (
              <div key={role.id} className="routine-row">
                <div>
                  <b>{role.name}</b>
                  <span>{role.system ? "Perfil del sistema" : "Perfil personalizado"}</span>
                </div>
                <strong className="row-number">{users.filter((user) => user.roleId === role.id && user.status !== "inactive").length}</strong>
              </div>
            ))}
          </div>
          <Button block icon={<ArrowRightOutlined />} style={{ marginTop: 12 }} onClick={() => navigate("/app/admin/usuarios")}>
            Gestionar usuarios
          </Button>
        </Card>
      </div>
    </div>
  );
}
