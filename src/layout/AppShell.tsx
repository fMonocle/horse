import {
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LineChartOutlined,
  LogoutOutlined,
  MenuOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, Layout, Menu, Segmented } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth";
import { athleteName, athletes, DEMO_ATHLETE_ID } from "../data/athletes";

const { Sider, Header, Content } = Layout;

const NAV_QUERY = "(max-width: 991px)";
const NARROW_QUERY = "(max-width: 720px)";

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

function useMedia(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);
    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [query]);

  return matches;
}

export function AppShell() {
  const { panel, setPanel, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const compactNav = useMedia(NAV_QUERY);
  const narrow = useMedia(NARROW_QUERY);
  const [navOpen, setNavOpen] = useState(false);
  const demoAthlete = athletes.find((athlete) => athlete.id === DEMO_ATHLETE_ID)!;
  const items = panel === "coach" ? coachItems : athleteItems;
  const selected = items.some((item) => item.key === location.pathname)
    ? location.pathname
    : items[0].key;

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!compactNav) setNavOpen(false);
  }, [compactNav]);

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[selected]}
      items={items}
      style={{ borderInlineEnd: "none", background: "transparent" }}
      onClick={({ key }) => {
        setNavOpen(false);
        navigate(key);
      }}
    />
  );

  return (
    <Layout className="app-frame">
      {!compactNav && (
        <Sider className="app-sider" width={248} style={{ background: "#DDE0E6", borderRight: "1px solid #CDD1D8" }}>
          <div className="brand">
            <img src={`${import.meta.env.BASE_URL}horse-logo.png`} alt="HORSE" />
          </div>
          {menu}
        </Sider>
      )}
      <Layout>
        <Header className="shell-header">
          {compactNav && (
            <Button
              className="nav-toggle"
              aria-label="Abrir menú"
              icon={<MenuOutlined />}
              onClick={() => setNavOpen(true)}
            />
          )}
          <div className="header-main">
            <Segmented
              block={narrow}
              className="panel-switch"
              value={panel}
              options={[
                { label: narrow ? "Entrenador" : "Panel de entrenador", value: "coach" },
                { label: narrow ? "Deportista" : "Panel del deportista", value: "athlete" },
              ]}
              onChange={(value) => {
                const next = value as "coach" | "athlete";
                setPanel(next);
                navigate(next === "coach" ? "/app" : "/app/mi-semana");
              }}
            />
          </div>
          <div className="header-actions">
            <span className="header-who">
              {panel === "athlete" ? athleteName(demoAthlete) : "Owner"}
            </span>
            <Avatar
              style={{ background: "#12151C" }}
              icon={panel === "athlete" ? <UserOutlined /> : undefined}
            >
              {panel === "coach" ? "OW" : demoAthlete.firstName.slice(0, 1)}
            </Avatar>
            <Button
              className="logout-button"
              aria-label="Salir"
              icon={<LogoutOutlined />}
              onClick={() => {
                signOut();
                navigate("/");
              }}
            >
              <span className="logout-label">Salir</span>
            </Button>
          </div>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </Layout>
      <Drawer
        placement="left"
        open={navOpen}
        onClose={() => setNavOpen(false)}
        width={280}
        title={<img className="drawer-logo" src={`${import.meta.env.BASE_URL}horse-logo.png`} alt="HORSE" />}
        styles={{
          header: { background: "#DDE0E6", borderBottom: "1px solid #CDD1D8" },
          body: { padding: "8px 8px 16px", background: "#DDE0E6" },
        }}
      >
        {menu}
      </Drawer>
    </Layout>
  );
}
