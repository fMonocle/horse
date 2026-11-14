import { BellOutlined, LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { Avatar, Badge, Button, Drawer, Layout, Menu, Segmented, Select } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { navItems, useAlertCount, usePanelAccess } from "../access";
import { useAdmin } from "../admin-store";
import { useAuth } from "../auth";
import { panelRole, PERSONA_USER } from "../data/platform";
import { clearPersistedState } from "../persisted-state";
import type { Panel } from "../types";

const { Sider, Header, Content } = Layout;

const NAV_QUERY = "(max-width: 991px)";
const NARROW_QUERY = "(max-width: 720px)";

const panelOptions: Array<{ label: string; value: Panel }> = [
  { label: "Owner", value: "owner" },
  { label: "Entrenador", value: "coach" },
  { label: "Deportista", value: "athlete" },
  { label: "Médico", value: "doctor" },
];

const alertTarget: Partial<Record<Panel, string>> = {
  coach: "/app/incidencias",
  doctor: "/app/incidencias",
  athlete: "/app/mi-historial",
};

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

function initials(name: string): string {
  return name
    .replace(/^(Dra?\.|Lic\.)\s+/, "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function AppShell() {
  const { panel, setPanel, signOut } = useAuth();
  const { users, roles } = useAdmin();
  const { items } = usePanelAccess();
  const alerts = useAlertCount();
  const navigate = useNavigate();
  const location = useLocation();
  const compactNav = useMedia(NAV_QUERY);
  const narrow = useMedia(NARROW_QUERY);
  const [navOpen, setNavOpen] = useState(false);
  const persona = users.find((user) => user.id === PERSONA_USER[panel]);
  const roleName = roles.find((role) => role.id === panelRole[panel])?.name ?? "";
  const selected =
    items
      .filter((item) => location.pathname === item.key || location.pathname.startsWith(`${item.key}/`))
      .sort((a, b) => b.key.length - a.key.length)[0]?.key ?? "";
  const badgeKey = alertTarget[panel];

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!compactNav) setNavOpen(false);
  }, [compactNav]);

  function switchPanel(next: Panel) {
    const modules = new Set(roles.find((role) => role.id === panelRole[next])?.modules ?? []);
    setPanel(next);
    navigate(navItems.find((item) => modules.has(item.module))?.key ?? "/app");
  }

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[selected]}
      items={items.map((item) => ({
        key: item.key,
        icon: item.icon,
        label:
          item.key === badgeKey && alerts > 0 ? (
            <span className="menu-badge">
              {item.label}
              <Badge count={alerts} size="small" />
            </span>
          ) : (
            item.label
          ),
      }))}
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
            {narrow ? (
              <Select
                className="panel-switch"
                value={panel}
                options={panelOptions.map((option) => ({ ...option, label: `Vista: ${option.label}` }))}
                onChange={switchPanel}
              />
            ) : (
              <Segmented
                className="panel-switch"
                value={panel}
                options={panelOptions}
                onChange={(value) => switchPanel(value as Panel)}
              />
            )}
          </div>
          <div className="header-actions">
            {badgeKey && (
              <Badge count={alerts} size="small" offset={[-4, 4]}>
                <Button
                  aria-label="Alertas"
                  icon={<BellOutlined />}
                  onClick={() => navigate(badgeKey)}
                />
              </Badge>
            )}
            <span className="header-who">
              <b>{persona?.name}</b>
              <small>{roleName}</small>
            </span>
            <Avatar style={{ background: "#12151C" }}>{initials(persona?.name ?? "H")}</Avatar>
            <Button
              className="logout-button"
              aria-label="Salir"
              icon={<LogoutOutlined />}
              onClick={() => {
                signOut();
                clearPersistedState();
                window.location.assign(import.meta.env.BASE_URL);
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
