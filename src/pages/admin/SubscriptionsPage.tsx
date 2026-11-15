import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Dropdown, Form, Input, Modal, Segmented, Select, Table, Tag } from "antd";
import { useState } from "react";
import { useAdmin } from "../../admin-store";
import { formatShort, fromIso, todayIso } from "../../dates";
import { formatMoney, subscriptionStatusColor, subscriptionStatusLabel } from "../../data/platform";
import { cellLabel } from "../../finance";
import type { Subscription, SubscriptionStatus } from "../../types";

type Scope = SubscriptionStatus | "all";

function dueText(nextDue: string | null): string {
  if (!nextDue) return "Sin vencimiento";
  const days = Math.round((fromIso(nextDue).getTime() - fromIso(todayIso()).getTime()) / 86_400_000);
  if (days < 0) return `Vencida hace ${-days} ${-days === 1 ? "día" : "días"}`;
  if (days === 0) return "Vence hoy";
  return `Vence en ${days} ${days === 1 ? "día" : "días"}`;
}

export function SubscriptionsPage() {
  const admin = useAdmin();
  const { subscriptions, users, plans } = admin;
  const { message, modal } = App.useApp();
  const [scope, setScope] = useState<Scope>("all");
  const [query, setQuery] = useState("");
  const [changing, setChanging] = useState<Subscription | null>(null);
  const [planId, setPlanId] = useState<string>();
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm<{ userId: string; planId: string }>();

  const userName = (id: string) => users.find((user) => user.id === id)?.name ?? "Usuario";
  const plan = (id: string) => plans.find((item) => item.id === id);
  const count = (status: SubscriptionStatus) => subscriptions.filter((item) => item.status === status).length;

  const text = query.trim().toLowerCase();
  const rows = subscriptions
    .filter((item) => scope === "all" || item.status === scope)
    .filter((item) => !text || userName(item.userId).toLowerCase().includes(text))
    .sort((a, b) => (a.nextDue ?? "9999").localeCompare(b.nextDue ?? "9999"));

  const withoutSubscription = users.filter(
    (user) =>
      user.roleId === "athlete" &&
      user.status !== "inactive" &&
      !subscriptions.some((item) => item.userId === user.id && item.status !== "cancelled"),
  );

  function act(key: string, item: Subscription) {
    const name = userName(item.userId);
    if (key === "plan") {
      setChanging(item);
      setPlanId(item.planId);
      return;
    }
    if (key === "suspend") {
      admin.suspendSubscription(item.id);
      message.success(`Suscripción de ${name} suspendida.`);
    }
    if (key === "reactivate") {
      admin.reactivateSubscription(item.id);
      message.success(`Suscripción de ${name} reactivada.`);
    }
    if (key === "cancel") {
      modal.confirm({
        title: `¿Dar de baja la suscripción de ${name}?`,
        content: "Deja de renovarse. El historial de pagos se conserva.",
        okText: "Dar de baja",
        okButtonProps: { danger: true },
        cancelText: "Volver",
        onOk: () => {
          admin.cancelSubscription(item.id);
          message.success(`Suscripción de ${name} dada de baja.`);
        },
      });
    }
  }

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Suscripciones</h1>
          <p>Vencimientos, renovaciones, cancelaciones y estado de cada cuenta.</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setCreating(true);
          }}
        >
          Nueva suscripción
        </Button>
      </div>
      <div className="stat-grid">
        <article className="stat-card tone-done">
          <span>Al día</span>
          <strong>{count("current")}</strong>
        </article>
        <article className="stat-card tone-pending">
          <span>Pendientes de pago</span>
          <strong>{count("pending")}</strong>
        </article>
        <article className="stat-card tone-alert">
          <span>Suspendidas</span>
          <strong>{count("suspended")}</strong>
        </article>
        <article className="stat-card tone-muted">
          <span>Dadas de baja</span>
          <strong>{count("cancelled")}</strong>
        </article>
      </div>
      <div className="filters">
        <Segmented
          value={scope}
          onChange={(value) => setScope(value as Scope)}
          options={[
            { label: "Todas", value: "all" },
            ...(Object.keys(subscriptionStatusLabel) as SubscriptionStatus[]).map((status) => ({
              label: subscriptionStatusLabel[status],
              value: status,
            })),
          ]}
        />
        <Input.Search allowClear className="filter-search" placeholder="Buscar por nombre" onChange={(event) => setQuery(event.target.value)} />
      </div>
      <Table
        className="stack-table"
        rowKey="id"
        dataSource={rows}
        pagination={false}
        scroll={{ x: true }}
        columns={[
          { title: "Cuenta", onCell: () => cellLabel("Cuenta"), render: (_, item) => <b>{userName(item.userId)}</b> },
          {
            title: "Plan",
            onCell: () => cellLabel("Plan"),
            render: (_, item) => {
              const current = plan(item.planId);
              return (
                <span>
                  {current?.name} · {formatMoney(current?.price ?? 0)}
                </span>
              );
            },
          },
          {
            title: "Estado",
            dataIndex: "status",
            onCell: () => cellLabel("Estado"),
            render: (value: SubscriptionStatus) => <Tag color={subscriptionStatusColor[value]}>{subscriptionStatusLabel[value]}</Tag>,
          },
          {
            title: "Vencimiento",
            onCell: () => cellLabel("Vencimiento"),
            render: (_, item) =>
              item.status === "cancelled" ? (
                <span>Baja el {formatShort(item.cancelledAt!)}</span>
              ) : (
                <div>
                  <div>{formatShort(item.nextDue!)}</div>
                  <small style={{ color: item.nextDue! < todayIso() ? "#c2410c" : "#5C6570" }}>{dueText(item.nextDue)}</small>
                </div>
              ),
          },
          {
            title: "Renovación",
            dataIndex: "autoRenew",
            onCell: () => cellLabel("Renovación"),
            render: (value: boolean) => <Tag color={value ? "blue" : "default"}>{value ? "Automática" : "Manual"}</Tag>,
          },
          {
            title: "",
            onCell: () => cellLabel("Acciones"),
            render: (_, item) => (
              <div className="row-actions">
                {item.status !== "cancelled" && (
                  <Button
                    size="small"
                    type={item.status === "current" ? "default" : "primary"}
                    onClick={() => {
                      admin.renewSubscription(item.id);
                      message.success(`Cobro registrado. ${userName(item.userId)} queda al día.`);
                    }}
                  >
                    {item.status === "current" ? "Renovar" : "Registrar pago"}
                  </Button>
                )}
                <Dropdown
                  menu={{
                    items: [
                      { key: "plan", label: "Cambiar de plan", disabled: item.status === "cancelled" },
                      { key: "suspend", label: "Suspender", disabled: item.status === "suspended" || item.status === "cancelled" },
                      { key: "reactivate", label: "Reactivar", disabled: item.status === "current" || item.status === "pending" },
                      { key: "cancel", label: "Dar de baja", danger: true, disabled: item.status === "cancelled" },
                    ],
                    onClick: ({ key }) => act(key, item),
                  }}
                >
                  <Button size="small">Más</Button>
                </Dropdown>
              </div>
            ),
          },
        ]}
      />
      <Modal
        title={changing ? `Cambiar el plan de ${userName(changing.userId)}` : ""}
        open={changing !== null}
        onCancel={() => setChanging(null)}
        okText="Cambiar plan"
        cancelText="Cancelar"
        onOk={() => {
          if (changing && planId) {
            admin.changePlan(changing.id, planId);
            message.success(`Plan cambiado a ${plan(planId)?.name}. Se cobra desde el próximo vencimiento.`);
          }
          setChanging(null);
        }}
      >
        <Select
          style={{ width: "100%", marginTop: 12 }}
          value={planId}
          onChange={setPlanId}
          options={plans.filter((item) => item.active).map((item) => ({ value: item.id, label: `${item.name} · ${formatMoney(item.price)}` }))}
        />
      </Modal>
      <Modal
        title="Nueva suscripción"
        open={creating}
        onCancel={() => setCreating(false)}
        onOk={() => form.submit()}
        okText="Crear y registrar cobro"
        cancelText="Cancelar"
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 12 }}
          onFinish={(values) => {
            admin.addSubscription(values.userId, values.planId);
            message.success(`Suscripción creada para ${userName(values.userId)}.`);
            setCreating(false);
          }}
        >
          <Form.Item name="userId" label="Cuenta" rules={[{ required: true, message: "Elegí una cuenta" }]}>
            <Select
              placeholder={withoutSubscription.length ? "Elegir" : "Todas las cuentas tienen suscripción"}
              options={withoutSubscription.map((user) => ({ value: user.id, label: user.name }))}
            />
          </Form.Item>
          <Form.Item name="planId" label="Plan" rules={[{ required: true, message: "Elegí un plan" }]}>
            <Select options={plans.filter((item) => item.active).map((item) => ({ value: item.id, label: `${item.name} · ${formatMoney(item.price)}` }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
