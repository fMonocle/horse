import {
  AlertOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  CrownOutlined,
  DashboardOutlined,
  DollarOutlined,
  FileTextOutlined,
  HistoryOutlined,
  LineChartOutlined,
  MedicineBoxOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useMemo, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAdmin, useMyAthletes } from "./admin-store";
import { useAuth } from "./auth";
import { DEMO_ATHLETE_ID } from "./data/athletes";
import { panelRole, PERSONA_USER } from "./data/platform";
import { useFollowup } from "./followup-store";
import type { Incident, ModuleKey } from "./types";

export type NavItem = {
  key: string;
  module: ModuleKey;
  icon: ReactNode;
  label: string;
};

export const navItems: NavItem[] = [
  { key: "/app/admin", module: "admin-dashboard", icon: <DashboardOutlined />, label: "Resumen" },
  { key: "/app/admin/usuarios", module: "users", icon: <UsergroupAddOutlined />, label: "Usuarios" },
  { key: "/app/admin/roles", module: "roles", icon: <SafetyCertificateOutlined />, label: "Roles y permisos" },
  { key: "/app/admin/asignaciones", module: "assignments", icon: <ApartmentOutlined />, label: "Asignaciones" },
  { key: "/app/admin/planes", module: "plans", icon: <CrownOutlined />, label: "Planes" },
  { key: "/app/admin/suscripciones", module: "subscriptions", icon: <CreditCardOutlined />, label: "Suscripciones" },
  { key: "/app/admin/finanzas", module: "finance", icon: <DollarOutlined />, label: "Finanzas" },
  { key: "/app", module: "coach-dashboard", icon: <DashboardOutlined />, label: "Panel" },
  { key: "/app/deportistas", module: "athletes", icon: <TeamOutlined />, label: "Deportistas" },
  { key: "/app/rutina", module: "routine", icon: <FileTextOutlined />, label: "Rutina" },
  { key: "/app/planificacion", module: "planning", icon: <CalendarOutlined />, label: "Planificación" },
  { key: "/app/seguimiento", module: "tracking", icon: <LineChartOutlined />, label: "Seguimiento" },
  { key: "/app/medico", module: "doctor-dashboard", icon: <MedicineBoxOutlined />, label: "Panel médico" },
  { key: "/app/incidencias", module: "incidents", icon: <AlertOutlined />, label: "Incidencias" },
  { key: "/app/mi-semana", module: "my-week", icon: <CalendarOutlined />, label: "Mi semana" },
  { key: "/app/mi-historial", module: "my-history", icon: <HistoryOutlined />, label: "Mi historial" },
  { key: "/app/mi-evolucion", module: "my-progress", icon: <LineChartOutlined />, label: "Mi evolución" },
];

export function usePanelAccess() {
  const { panel } = useAuth();
  const { roles } = useAdmin();
  return useMemo(() => {
    const role = roles.find((item) => item.id === panelRole[panel]);
    const modules = new Set<ModuleKey>(role?.modules ?? []);
    const items = navItems.filter((item) => modules.has(item.module));
    return {
      modules,
      items,
      landing: items[0]?.key ?? "/app/sin-acceso",
      can: (module: ModuleKey) => modules.has(module),
    };
  }, [panel, roles]);
}

export function RequireModule({ module, children }: { module: ModuleKey; children: ReactNode }) {
  const { can, landing } = usePanelAccess();
  if (!can(module)) {
    return <Navigate to={landing} replace />;
  }
  return <>{children}</>;
}

export function useVisibleIncidents(): Incident[] {
  const { panel } = useAuth();
  const { incidents } = useFollowup();
  const { assignments } = useAdmin();
  const myAthletes = useMyAthletes();
  return useMemo(() => {
    if (panel === "coach") {
      const ids = new Set(myAthletes.map((athlete) => athlete.id));
      return incidents.filter((incident) => ids.has(incident.athleteId));
    }
    if (panel === "doctor") {
      const ids = new Set(
        assignments
          .filter((item) => item.professionalIds.includes(PERSONA_USER.doctor))
          .map((item) => item.athleteId),
      );
      return incidents.filter((incident) => incident.sharedWithMedical && ids.has(incident.athleteId));
    }
    if (panel === "athlete") {
      return incidents.filter((incident) => incident.athleteId === DEMO_ATHLETE_ID);
    }
    return [];
  }, [assignments, incidents, myAthletes, panel]);
}

export function useAlertCount(): number {
  const { panel } = useAuth();
  const visible = useVisibleIncidents();
  if (panel === "coach") return visible.filter((incident) => !incident.coachSeen).length;
  if (panel === "doctor") return visible.filter((incident) => incident.status === "docs_sent" || incident.status === "open").length;
  if (panel === "athlete") return visible.filter((incident) => incident.status === "docs_requested").length;
  return 0;
}
