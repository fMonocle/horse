import { addMonths, daysFromToday, todayIso } from "../dates";
import type {
  Assignment,
  ModuleKey,
  Movement,
  Panel,
  Plan,
  Role,
  Subscription,
  SubscriptionStatus,
  User,
  UserStatus,
} from "../types";

export const moduleCatalog: Array<{ key: ModuleKey; label: string; area: string }> = [
  { key: "admin-dashboard", label: "Resumen de la plataforma", area: "Administración" },
  { key: "users", label: "Usuarios", area: "Administración" },
  { key: "roles", label: "Roles y permisos", area: "Administración" },
  { key: "assignments", label: "Asignaciones", area: "Administración" },
  { key: "plans", label: "Planes", area: "Comercial" },
  { key: "subscriptions", label: "Suscripciones", area: "Comercial" },
  { key: "finance", label: "Finanzas", area: "Comercial" },
  { key: "coach-dashboard", label: "Panel de entrenador", area: "Deportivo" },
  { key: "athletes", label: "Deportistas", area: "Deportivo" },
  { key: "routine", label: "Rutina", area: "Deportivo" },
  { key: "planning", label: "Planificación", area: "Deportivo" },
  { key: "tracking", label: "Seguimiento", area: "Deportivo" },
  { key: "incidents", label: "Incidencias", area: "Médico" },
  { key: "doctor-dashboard", label: "Panel médico", area: "Médico" },
  { key: "my-week", label: "Mi semana", area: "Deportista" },
  { key: "my-history", label: "Mi historial", area: "Deportista" },
  { key: "my-progress", label: "Mi evolución", area: "Deportista" },
];

export const initialRoles: Role[] = [
  {
    id: "owner",
    name: "Owner",
    description: "Administra la plataforma, los usuarios, los planes y las finanzas.",
    modules: ["admin-dashboard", "users", "roles", "assignments", "plans", "subscriptions", "finance"],
    system: true,
  },
  {
    id: "coach",
    name: "Entrenador",
    description: "Planifica, asigna rutinas y sigue a sus deportistas.",
    modules: ["coach-dashboard", "athletes", "routine", "planning", "tracking", "incidents"],
    system: true,
  },
  {
    id: "athlete",
    name: "Deportista",
    description: "Ve su semana, informa sus rutinas y reporta molestias.",
    modules: ["my-week", "my-history", "my-progress"],
    system: true,
  },
  {
    id: "doctor",
    name: "Médico",
    description: "Consulta las incidencias autorizadas y registra su evaluación.",
    modules: ["doctor-dashboard", "incidents"],
    system: true,
  },
  {
    id: "kinesio",
    name: "Kinesiología",
    description: "Acompaña la recuperación de las incidencias autorizadas.",
    modules: ["incidents"],
    system: false,
  },
];

export const panelRole: Record<Panel, string> = {
  owner: "owner",
  coach: "coach",
  athlete: "athlete",
  doctor: "doctor",
};

export const PERSONA_USER: Record<Panel, string> = {
  owner: "u-owner",
  coach: "u-coach-1",
  athlete: "u-a1",
  doctor: "u-doc-1",
};

export const userStatusLabel: Record<UserStatus, string> = {
  active: "Activo",
  invited: "Invitado",
  suspended: "Suspendido",
  inactive: "Dado de baja",
};

export const userStatusColor: Record<UserStatus, string> = {
  active: "green",
  invited: "blue",
  suspended: "orange",
  inactive: "default",
};

export const initialUsers: User[] = [
  { id: "u-owner", name: "Carolina Méndez", email: "carolina.mendez@horse.app", roleId: "owner", status: "active", createdAt: addMonths(todayIso(), -14) },
  { id: "u-coach-1", name: "Martín Sosa", email: "martin.sosa@horse.app", roleId: "coach", status: "active", createdAt: addMonths(todayIso(), -13) },
  { id: "u-coach-2", name: "Diego Herrera", email: "diego.herrera@horse.app", roleId: "coach", status: "active", createdAt: addMonths(todayIso(), -9) },
  { id: "u-coach-3", name: "Ana Castro", email: "ana.castro@horse.app", roleId: "coach", status: "invited", createdAt: daysFromToday(-4) },
  { id: "u-doc-1", name: "Dra. Paula Ortiz", email: "paula.ortiz@horse.app", roleId: "doctor", status: "active", createdAt: addMonths(todayIso(), -12) },
  { id: "u-doc-2", name: "Dr. Ricardo Vega", email: "ricardo.vega@horse.app", roleId: "doctor", status: "active", createdAt: addMonths(todayIso(), -7) },
  { id: "u-kine-1", name: "Lic. Nora Díaz", email: "nora.diaz@horse.app", roleId: "kinesio", status: "active", createdAt: addMonths(todayIso(), -5) },
  { id: "u-a1", name: "Valentina Ruiz", email: "valentina.ruiz@horse.app", roleId: "athlete", status: "active", athleteId: "a1", createdAt: addMonths(todayIso(), -8) },
  { id: "u-a2", name: "Mateo Duarte", email: "mateo.duarte@horse.app", roleId: "athlete", status: "active", athleteId: "a2", createdAt: addMonths(todayIso(), -10) },
  { id: "u-a3", name: "Camila Ferreira", email: "camila.ferreira@horse.app", roleId: "athlete", status: "active", athleteId: "a3", createdAt: addMonths(todayIso(), -11) },
  { id: "u-a4", name: "Ignacio Paredes", email: "ignacio.paredes@horse.app", roleId: "athlete", status: "active", athleteId: "a4", createdAt: addMonths(todayIso(), -6) },
  { id: "u-a5", name: "Lucía Benítez", email: "lucia.benitez@horse.app", roleId: "athlete", status: "active", athleteId: "a5", createdAt: addMonths(todayIso(), -7) },
  { id: "u-a6", name: "Andrés Quispe", email: "andres.quispe@horse.app", roleId: "athlete", status: "active", athleteId: "a6", createdAt: addMonths(todayIso(), -9) },
  { id: "u-a7", name: "Martina Gómez", email: "martina.gomez@horse.app", roleId: "athlete", status: "active", athleteId: "a7", createdAt: addMonths(todayIso(), -12) },
  { id: "u-a8", name: "Sofía Almeida", email: "sofia.almeida@horse.app", roleId: "athlete", status: "active", athleteId: "a8", createdAt: addMonths(todayIso(), -4) },
  { id: "u-x1", name: "Julieta Paz", email: "julieta.paz@horse.app", roleId: "athlete", status: "suspended", createdAt: addMonths(todayIso(), -9) },
  { id: "u-x2", name: "Tomás Rivas", email: "tomas.rivas@horse.app", roleId: "athlete", status: "inactive", createdAt: addMonths(todayIso(), -11) },
];

export const initialAssignments: Assignment[] = [
  { athleteId: "a1", coachId: "u-coach-1", professionalIds: ["u-doc-1", "u-kine-1"] },
  { athleteId: "a2", coachId: "u-coach-1", professionalIds: ["u-doc-1"] },
  { athleteId: "a3", coachId: "u-coach-1", professionalIds: ["u-doc-1", "u-kine-1"] },
  { athleteId: "a4", coachId: "u-coach-2", professionalIds: ["u-doc-2"] },
  { athleteId: "a5", coachId: "u-coach-1", professionalIds: ["u-doc-1"] },
  { athleteId: "a6", coachId: "u-coach-1", professionalIds: ["u-doc-2"] },
  { athleteId: "a7", coachId: "u-coach-1", professionalIds: ["u-doc-1"] },
  { athleteId: "a8", coachId: "u-coach-2", professionalIds: ["u-doc-2"] },
];

export const initialPlans: Plan[] = [
  {
    id: "bronce",
    name: "Bronce",
    price: 90,
    periodMonths: 1,
    description: "Para empezar a planificar y registrar las sesiones.",
    features: ["Planificación semanal", "Registro de sesiones", "Evolución del deportista"],
    color: "#A86B3C",
    custom: false,
    active: true,
  },
  {
    id: "plata",
    name: "Plata",
    price: 150,
    periodMonths: 1,
    description: "Suma rutinas asignadas, reportes y alertas.",
    features: [
      "Planificación semanal",
      "Registro de sesiones",
      "Evolución del deportista",
      "Rutinas con reporte del deportista",
      "Alertas de incidencias",
    ],
    color: "#7D8592",
    custom: false,
    active: true,
  },
  {
    id: "oro",
    name: "Oro",
    price: 240,
    periodMonths: 1,
    description: "Seguimiento completo, con equipo médico e historial.",
    features: [
      "Planificación semanal",
      "Registro de sesiones",
      "Evolución del deportista",
      "Rutinas con reporte del deportista",
      "Alertas de incidencias",
      "Seguimiento médico",
      "Historial completo",
    ],
    color: "#C9A227",
    custom: false,
    active: true,
  },
  {
    id: "club",
    name: "Club",
    price: 900,
    periodMonths: 1,
    description: "Plan a medida para clubes, hasta diez deportistas.",
    features: ["Todo lo del plan Oro", "Hasta 10 deportistas", "Reportes por equipo"],
    color: "#2F6BFF",
    custom: true,
    active: true,
  },
];

export const subscriptionStatusLabel: Record<SubscriptionStatus, string> = {
  current: "Al día",
  pending: "Pendiente",
  suspended: "Suspendida",
  cancelled: "Dada de baja",
};

export const subscriptionStatusColor: Record<SubscriptionStatus, string> = {
  current: "green",
  pending: "gold",
  suspended: "orange",
  cancelled: "default",
};

export const initialSubscriptions: Subscription[] = [
  { id: "sub-a1", userId: "u-a1", planId: "oro", status: "current", startDate: addMonths(todayIso(), -8), nextDue: daysFromToday(12), autoRenew: true },
  { id: "sub-a2", userId: "u-a2", planId: "plata", status: "current", startDate: addMonths(todayIso(), -10), nextDue: daysFromToday(5), autoRenew: true },
  { id: "sub-a3", userId: "u-a3", planId: "oro", status: "current", startDate: addMonths(todayIso(), -11), nextDue: daysFromToday(20), autoRenew: true },
  { id: "sub-a4", userId: "u-a4", planId: "plata", status: "pending", startDate: addMonths(todayIso(), -6), nextDue: daysFromToday(-3), autoRenew: true },
  { id: "sub-a5", userId: "u-a5", planId: "bronce", status: "current", startDate: addMonths(todayIso(), -7), nextDue: daysFromToday(9), autoRenew: true },
  { id: "sub-a6", userId: "u-a6", planId: "plata", status: "current", startDate: addMonths(todayIso(), -9), nextDue: daysFromToday(15), autoRenew: true },
  { id: "sub-a7", userId: "u-a7", planId: "oro", status: "current", startDate: addMonths(todayIso(), -12), nextDue: daysFromToday(25), autoRenew: true },
  { id: "sub-a8", userId: "u-a8", planId: "bronce", status: "pending", startDate: addMonths(todayIso(), -4), nextDue: daysFromToday(-1), autoRenew: false },
  { id: "sub-x1", userId: "u-x1", planId: "plata", status: "suspended", startDate: addMonths(todayIso(), -9), nextDue: daysFromToday(-24), autoRenew: false },
  { id: "sub-x2", userId: "u-x2", planId: "bronce", status: "cancelled", startDate: addMonths(todayIso(), -11), nextDue: null, autoRenew: false, cancelledAt: daysFromToday(-40) },
];

const sixMonthsAgo = addMonths(todayIso(), -6);

function subscriptionMovements(): Movement[] {
  const rows: Movement[] = [];
  const planPrice = new Map(initialPlans.map((plan) => [plan.id, plan.price]));
  const planName = new Map(initialPlans.map((plan) => [plan.id, plan.name]));
  const userName = new Map(initialUsers.map((user) => [user.id, user.name]));

  initialSubscriptions.forEach((subscription) => {
    const anchor = subscription.nextDue ?? subscription.cancelledAt!;
    const overdue = subscription.status === "pending" || subscription.status === "suspended";
    const first = subscription.status === "cancelled" || overdue ? 0 : 1;
    for (let back = first; back <= 6; back += 1) {
      const date = addMonths(anchor, -back);
      if (date < sixMonthsAgo || date < subscription.startDate) continue;
      if (subscription.status === "cancelled" && back === 0) continue;
      rows.push({
        id: `mv-${subscription.id}-${back}`,
        date,
        kind: "income",
        category: "Suscripción",
        description: `${planName.get(subscription.planId)} · ${userName.get(subscription.userId)}`,
        amount: planPrice.get(subscription.planId) ?? 0,
        status: overdue && back === 0 ? "pending" : "paid",
        subscriptionId: subscription.id,
      });
    }
  });
  return rows;
}

function expenseMovements(): Movement[] {
  const rows: Movement[] = [];
  const today = todayIso();
  const travel = [180, 240, 150, 320, 210, 260];
  for (let back = 5; back >= 0; back -= 1) {
    const base = addMonths(today, -back).slice(0, 8);
    const items: Array<[number, string, string, number]> = [
      [5, "Instalaciones", "Alquiler de gimnasio", 400],
      [10, "Equipo médico", "Honorarios del equipo médico", 300],
      [15, "Tecnología", "Software y hosting", 120],
      [20, "Viajes", "Viajes y competencias", travel[5 - back]],
    ];
    items.forEach(([day, category, description, amount]) => {
      const date = `${base}${String(day).padStart(2, "0")}`;
      rows.push({
        id: `mv-exp-${back}-${day}`,
        date,
        kind: "expense",
        category,
        description,
        amount,
        status: date > today ? "pending" : "paid",
      });
    });
  }
  return rows;
}

export const initialMovements: Movement[] = [...subscriptionMovements(), ...expenseMovements()].sort(
  (a, b) => b.date.localeCompare(a.date),
);

export const movementCategories = {
  income: ["Suscripción", "Clínica deportiva", "Patrocinio", "Otros ingresos"],
  expense: ["Instalaciones", "Equipo médico", "Tecnología", "Viajes", "Equipamiento", "Otros egresos"],
};

const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatMoney(value: number): string {
  return money.format(value);
}
