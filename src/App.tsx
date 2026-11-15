import { ConfigProvider, App as AntdApp } from "antd";
import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { RequireModule } from "./access";
import { AdminProvider } from "./admin-store";
import { AuthProvider } from "./auth";
import { FollowupProvider } from "./followup-store";
import { AppShell } from "./layout/AppShell";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AssignmentsPage } from "./pages/admin/AssignmentsPage";
import { FinancePage } from "./pages/admin/FinancePage";
import { PlansPage } from "./pages/admin/PlansPage";
import { RolesPage } from "./pages/admin/RolesPage";
import { SubscriptionsPage } from "./pages/admin/SubscriptionsPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { AthleteHistoryPage } from "./pages/AthleteHistoryPage";
import { AthleteProfilePage } from "./pages/AthleteProfilePage";
import { AthleteProgressPage, AthleteWeekPage } from "./pages/AthletePanelPages";
import { AthletesPage } from "./pages/AthletesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DoctorDashboardPage } from "./pages/DoctorDashboardPage";
import { ImportRoutinePage } from "./pages/ImportRoutinePage";
import { IncidentDetailPage } from "./pages/IncidentDetailPage";
import { IncidentsPage } from "./pages/IncidentsPage";
import { LoginPage } from "./pages/LoginPage";
import { PlanningPage } from "./pages/PlanningPage";
import { RoutineComparePage } from "./pages/RoutineComparePage";
import { RoutinePage } from "./pages/RoutinePage";
import { RoutineReportPage } from "./pages/RoutineReportPage";
import { TrackingPage } from "./pages/TrackingPage";
import { RequireAuth } from "./RequireAuth";
import { TrainingProvider } from "./store";
import { horseTheme } from "./theme";
import type { ModuleKey } from "./types";

function guard(module: ModuleKey, page: ReactNode) {
  return <RequireModule module={module}>{page}</RequireModule>;
}

export function App() {
  return (
    <ConfigProvider theme={horseTheme}>
      <AntdApp>
        <AuthProvider>
          <AdminProvider>
            <FollowupProvider>
              <TrainingProvider>
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route element={<RequireAuth />}>
                    <Route path="/app" element={<AppShell />}>
                      <Route index element={guard("coach-dashboard", <DashboardPage />)} />
                      <Route path="deportistas" element={guard("athletes", <AthletesPage />)} />
                      <Route path="deportistas/:id" element={guard("athletes", <AthleteProfilePage />)} />
                      <Route path="planificacion" element={guard("planning", <PlanningPage />)} />
                      <Route path="rutina" element={guard("routine", <RoutinePage />)} />
                      <Route path="importar" element={guard("routine", <ImportRoutinePage />)} />
                      <Route path="rutinas/:id" element={guard("routine", <RoutineComparePage />)} />
                      <Route path="seguimiento" element={guard("tracking", <TrackingPage />)} />
                      <Route path="incidencias" element={guard("incidents", <IncidentsPage />)} />
                      <Route path="incidencias/:id" element={guard("incidents", <IncidentDetailPage />)} />
                      <Route path="medico" element={guard("doctor-dashboard", <DoctorDashboardPage />)} />
                      <Route path="mi-semana" element={guard("my-week", <AthleteWeekPage />)} />
                      <Route path="mi-rutina/:id" element={guard("my-week", <RoutineReportPage />)} />
                      <Route path="mi-historial" element={guard("my-history", <AthleteHistoryPage />)} />
                      <Route path="mi-evolucion" element={guard("my-progress", <AthleteProgressPage />)} />
                      <Route path="admin" element={guard("admin-dashboard", <AdminDashboardPage />)} />
                      <Route path="admin/usuarios" element={guard("users", <UsersPage />)} />
                      <Route path="admin/roles" element={guard("roles", <RolesPage />)} />
                      <Route path="admin/asignaciones" element={guard("assignments", <AssignmentsPage />)} />
                      <Route path="admin/planes" element={guard("plans", <PlansPage />)} />
                      <Route path="admin/suscripciones" element={guard("subscriptions", <SubscriptionsPage />)} />
                      <Route path="admin/finanzas" element={guard("finance", <FinancePage />)} />
                      <Route path="sin-acceso" element={<div className="page"><p>Este perfil no tiene módulos habilitados.</p></div>} />
                    </Route>
                  </Route>
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </TrainingProvider>
            </FollowupProvider>
          </AdminProvider>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
