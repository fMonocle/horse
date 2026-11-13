import {
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LineChartOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Layout, Menu, Segmented } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { athleteName, athletes, DEMO_ATHLETE_ID } from "../data/athletes";

const { Sider, Header, Content } = Layout;

const coachItems = [
  { key: "/app", icon: <DashboardOutlined />, label: "Panel" },
  { key: "/app/deportistas", icon: <TeamOutlined />, label: "Deportistas" },
  { key: "/app/rutina", icon: <FileTextOutlined />, label: "Rutina" },
  { key: "/app/planificacion", icon: <CalendarOutlined />, label: "Planificación" },
  { key: "/app/seguimiento", icon: <LineChartOutlined />, label: "Seguimiento" },
];

const athleteItems = [
  { key: "/app/mi-semana", icon: <CalendarOutlined />, label: "Mi semana" },
  { key: "/app/mi-evolucion", icon: <LineChartOutlined />, label: "Mi evolución" },
];

export function AppShell() {
  const { panel, setPanel, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const demoAthlete = athletes.find((athlete) => athlete.id === DEMO_ATHLETE_ID)!;
  const items = panel === "coach" ? coachItems : athleteItems;
  const selected = items.some((item) => item.key === location.pathname)
    ? location.pathname
    : items[0].key;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={248} style={{ background: "#DDE0E6", borderRight: "1px solid #CDD1D8" }}>
        <div className="brand">
          <img src={`${import.meta.env.BASE_URL}horse-logo.png`} alt="HORSE" />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selected]}
          items={items}
          style={{ borderInlineEnd: "none", background: "transparent" }}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="shell-header">
          <Segmented
            value={panel}
            options={[
              { label: "Panel de entrenador", value: "coach" },
              { label: "Panel del deportista", value: "athlete" },
            ]}
            onChange={(value) => {
              const next = value as "coach" | "athlete";
              setPanel(next);
              navigate(next === "coach" ? "/app" : "/app/mi-semana");
            }}
          />
          <div className="header-actions">
            <span style={{ color: "#5C6570", fontSize: 13 }}>
              {panel === "athlete"
                ? athleteName(demoAthlete)
                : "Owner"}
            </span>
            <Avatar
              style={{ background: "#12151C" }}
              icon={panel === "athlete" ? <UserOutlined /> : undefined}
            >
              {panel === "coach" ? "OW" : demoAthlete.firstName.slice(0, 1)}
            </Avatar>
            <Button
              icon={<LogoutOutlined />}
              onClick={() => {
                signOut();
                navigate("/");
              }}
            >
              Salir
            </Button>
          </div>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
