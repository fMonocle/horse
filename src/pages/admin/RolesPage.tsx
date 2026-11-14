import { LockOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Checkbox, Form, Input, Modal, Tag } from "antd";
import { useState } from "react";
import { useAdmin } from "../../admin-store";
import { moduleCatalog } from "../../data/platform";
import type { ModuleKey, Role } from "../../types";

type Values = { name: string; description: string; modules: ModuleKey[] };

const areas = [...new Set(moduleCatalog.map((item) => item.area))];
const plural = (count: number) => `${count} ${count === 1 ? "usuario" : "usuarios"}`;

export function RolesPage() {
  const { roles, users, saveRole } = useAdmin();
  const { message } = App.useApp();
  const [form] = Form.useForm<Values>();
  const [editing, setEditing] = useState<Role | "new" | null>(null);
  const label = (key: ModuleKey) => moduleCatalog.find((item) => item.key === key)?.label ?? key;

  function open(role: Role | "new") {
    setEditing(role);
    form.setFieldsValue(
      role === "new"
        ? { name: "", description: "", modules: [] }
        : { name: role.name, description: role.description, modules: role.modules },
    );
  }

  function save(values: Values) {
    if (values.modules.length === 0) {
      message.warning("Elegí al menos un módulo.");
      return;
    }
    const current = editing && editing !== "new" ? editing : undefined;
    saveRole({ ...values, id: current?.id });
    message.success(current ? `Permisos de ${values.name} actualizados.` : `Perfil ${values.name} creado.`);
    setEditing(null);
  }

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Roles y permisos</h1>
          <p>Cada perfil ve solo sus módulos. Los cambios se aplican en el momento a todos sus usuarios.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => open("new")}>
          Nuevo perfil
        </Button>
      </div>
      <div className="role-grid">
        {roles.map((role) => (
          <Card key={role.id} className="role-card">
            <div className="incident-card-head">
              <h2>{role.name}</h2>
              <Tag color={role.system ? "blue" : "purple"}>{role.system ? "Sistema" : "Personalizado"}</Tag>
            </div>
            <p>{role.description}</p>
            <span className="role-count">
              {plural(users.filter((user) => user.roleId === role.id && user.status !== "inactive").length)}
            </span>
            <div className="module-tags">
              {role.modules.map((key) => (
                <Tag key={key}>{label(key)}</Tag>
              ))}
            </div>
            {role.id === "owner" ? (
              <Button block disabled icon={<LockOutlined />}>
                Acceso total a la administración
              </Button>
            ) : (
              <Button block onClick={() => open(role)}>
                Editar permisos
              </Button>
            )}
          </Card>
        ))}
      </div>
      <Modal
        title={editing === "new" ? "Nuevo perfil" : `Permisos de ${editing?.name ?? ""}`}
        open={editing !== null}
        onCancel={() => setEditing(null)}
        onOk={() => form.submit()}
        okText="Guardar"
        cancelText="Cancelar"
        width={640}
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={save} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Nombre del perfil" rules={[{ required: true, message: "Poné un nombre" }]}>
            <Input placeholder="Nutrición, Psicología deportiva…" disabled={editing !== "new" && editing?.system} />
          </Form.Item>
          <Form.Item name="description" label="Qué hace">
            <Input />
          </Form.Item>
          <Form.Item name="modules" label="Módulos que puede ver">
            <Checkbox.Group style={{ width: "100%" }}>
              <div className="module-groups">
                {areas.map((area) => (
                  <div key={area}>
                    <b>{area}</b>
                    {moduleCatalog
                      .filter((item) => item.area === area)
                      .map((item) => (
                        <Checkbox key={item.key} value={item.key}>
                          {item.label}
                        </Checkbox>
                      ))}
                  </div>
                ))}
              </div>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
