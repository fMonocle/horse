import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Dropdown, Form, Input, Modal, Select, Table, Tag } from "antd";
import { useMemo, useState } from "react";
import { useAdmin } from "../../admin-store";
import { formatShort } from "../../dates";
import { userStatusColor, userStatusLabel } from "../../data/platform";
import { cellLabel } from "../../finance";
import type { User, UserStatus } from "../../types";

type Values = { name: string; email: string; roleId: string; status: UserStatus };

const statuses = Object.keys(userStatusLabel) as UserStatus[];

export function UsersPage() {
  const { users, roles, saveUser, setUserStatus } = useAdmin();
  const { message } = App.useApp();
  const [form] = Form.useForm<Values>();
  const [query, setQuery] = useState("");
  const [roleId, setRoleId] = useState<string>();
  const [status, setStatus] = useState<UserStatus>();
  const [editing, setEditing] = useState<User | "new" | null>(null);

  const roleName = (id: string) => roles.find((role) => role.id === id)?.name ?? id;
  const rows = useMemo(() => {
    const text = query.trim().toLowerCase();
    return users.filter(
      (user) =>
        (!text || user.name.toLowerCase().includes(text) || user.email.toLowerCase().includes(text)) &&
        (!roleId || user.roleId === roleId) &&
        (!status || user.status === status),
    );
  }, [query, roleId, status, users]);

  function open(user: User | "new") {
    setEditing(user);
    form.setFieldsValue(
      user === "new"
        ? { name: "", email: "", roleId: "athlete", status: "invited" }
        : { name: user.name, email: user.email, roleId: user.roleId, status: user.status },
    );
  }

  function save(values: Values) {
    const current = editing && editing !== "new" ? editing : undefined;
    saveUser({ ...current, ...values, id: current?.id });
    message.success(current ? "Usuario actualizado." : "Usuario creado. Le llega la invitación por correo.");
    setEditing(null);
  }

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Usuarios</h1>
          <p>Altas, bajas, cambios de perfil y estado de cada cuenta.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => open("new")}>
          Nuevo usuario
        </Button>
      </div>
      <div className="stat-grid">
        <article className="stat-card tone-done">
          <span>Activos</span>
          <strong>{users.filter((user) => user.status === "active").length}</strong>
        </article>
        <article className="stat-card tone-athletes">
          <span>Invitados</span>
          <strong>{users.filter((user) => user.status === "invited").length}</strong>
        </article>
        <article className="stat-card tone-pending">
          <span>Suspendidos</span>
          <strong>{users.filter((user) => user.status === "suspended").length}</strong>
        </article>
        <article className="stat-card tone-muted">
          <span>Dados de baja</span>
          <strong>{users.filter((user) => user.status === "inactive").length}</strong>
        </article>
      </div>
      <div className="filters">
        <Input.Search allowClear className="filter-search" placeholder="Buscar por nombre o correo" onChange={(event) => setQuery(event.target.value)} />
        <Select allowClear className="filter-select" placeholder="Perfil" value={roleId} onChange={setRoleId} options={roles.map((role) => ({ value: role.id, label: role.name }))} />
        <Select allowClear className="filter-select" placeholder="Estado" value={status} onChange={setStatus} options={statuses.map((item) => ({ value: item, label: userStatusLabel[item] }))} />
      </div>
      <Table
        className="stack-table"
        rowKey="id"
        dataSource={rows}
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        scroll={{ x: true }}
        columns={[
          {
            title: "Usuario",
            onCell: () => cellLabel("Usuario"),
            render: (_, user) => (
              <div>
                <b>{user.name}</b>
                <div style={{ color: "#5C6570", fontSize: 12 }}>{user.email}</div>
              </div>
            ),
          },
          { title: "Perfil", dataIndex: "roleId", onCell: () => cellLabel("Perfil"), render: (value: string) => <Tag>{roleName(value)}</Tag> },
          {
            title: "Estado",
            dataIndex: "status",
            onCell: () => cellLabel("Estado"),
            render: (value: UserStatus) => <Tag color={userStatusColor[value]}>{userStatusLabel[value]}</Tag>,
          },
          { title: "Alta", dataIndex: "createdAt", onCell: () => cellLabel("Alta"), render: (value: string) => formatShort(value) },
          {
            title: "",
            onCell: () => cellLabel("Acciones"),
            render: (_, user) => (
              <div className="row-actions">
                <Button size="small" onClick={() => open(user)}>
                  Editar
                </Button>
                <Dropdown
                  disabled={user.roleId === "owner"}
                  menu={{
                    items: [
                      { key: "active", label: "Activar", disabled: user.status === "active" },
                      { key: "suspended", label: "Suspender", disabled: user.status === "suspended" },
                      { key: "inactive", label: "Dar de baja", danger: true, disabled: user.status === "inactive" },
                    ],
                    onClick: ({ key }) => {
                      setUserStatus(user.id, key as UserStatus);
                      message.success(`${user.name}: ${userStatusLabel[key as UserStatus].toLowerCase()}.`);
                    },
                  }}
                >
                  <Button size="small">Estado</Button>
                </Dropdown>
              </div>
            ),
          },
        ]}
      />
      <Modal
        title={editing === "new" ? "Nuevo usuario" : "Editar usuario"}
        open={editing !== null}
        onCancel={() => setEditing(null)}
        onOk={() => form.submit()}
        okText="Guardar"
        cancelText="Cancelar"
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={save} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Nombre y apellido" rules={[{ required: true, message: "Completá el nombre" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Correo" rules={[{ required: true, type: "email", message: "Poné un correo válido" }]}>
            <Input />
          </Form.Item>
          <div className="form-row">
            <Form.Item name="roleId" label="Perfil" rules={[{ required: true }]}>
              <Select disabled={editing !== "new" && editing?.roleId === "owner"} options={roles.map((role) => ({ value: role.id, label: role.name }))} />
            </Form.Item>
            <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
              <Select options={statuses.map((item) => ({ value: item, label: userStatusLabel[item] }))} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
