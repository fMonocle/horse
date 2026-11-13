import { ConfigProvider, App as AntdApp } from "antd";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth";
import { AppShell } from "./layout/AppShell";
import { AthleteProfilePage } from "./pages/AthleteProfilePage";
import { AthleteProgressPage, AthleteWeekPage } from "./pages/AthletePanelPages";
import { AthletesPage } from "./pages/AthletesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { PlanningPage } from "./pages/PlanningPage";
import { TrackingPage } from "./pages/TrackingPage";
import { RequireAuth } from "./RequireAuth";
import { TrainingProvider } from "./store";
import { horseTheme } from "./theme";

export function App() {
  return (
    <ConfigProvider theme={horseTheme}>
      <AntdApp>
        <AuthProvider>
          <TrainingProvider>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route element={<RequireAuth />}>
                <Route path="/app" element={<AppShell />}>
                  <Route index element={<DashboardPage />} />
                  <Route path="deportistas" element={<AthletesPage />} />
                  <Route path="deportistas/:id" element={<AthleteProfilePage />} />
                  <Route path="planificacion" element={<PlanningPage />} />
                  <Route path="seguimiento" element={<TrackingPage />} />
                  <Route path="mi-semana" element={<AthleteWeekPage />} />
                  <Route path="mi-evolucion" element={<AthleteProgressPage />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TrainingProvider>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
