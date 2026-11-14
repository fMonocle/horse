import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, Form, Input, InputNumber, Modal, Select, Switch, Tag } from "antd";
import { useState } from "react";
import { useAdmin } from "../../admin-store";
import { formatMoney } from "../../data/platform";
import type { Plan, PlanPeriod } from "../../types";

type Values = {
  name: string;
  price: number;
  periodMonths: PlanPeriod;
  description: string;
  features: string[];
  color: string;
  active: boolean;
};

const periodLabel: Record<PlanPeriod, string> = { 1: "mes", 3: "trimestre", 12: "año" };

const palette = [
  { value: "#A86B3C", label: "Bronce" },
  { value: "#7D8592", label: "Plata" },
  { value: "#C9A227", label: "Oro" },
  { value: "#2F6BFF", label: "Azul HORSE" },
  { value: "#2F6B45", label: "Verde" },
  { value: "#5B4D8A", label: "Violeta" },
];

export function PlansPage() {
  const { plans, subscriptions, savePlan } = useAdmin();
  const { message } = App.useApp();
  const [form] = Form.useForm<Values>();
  const [editing, setEditing] = useState<Plan | "new" | null>(null);
  const featureOptions = [...new Set(plans.flatMap((plan) => plan.features))].map((value) => ({ value }));

  function open(plan: Plan | "new") {
    setEditing(plan);
    form.setFieldsValue(
      plan === "new"
        ? { name: "", price: 200, periodMonths: 1, description: "", features: [], color: "#2F6BFF", active: true }
        : { ...plan },
    );
  }

  function save(values: Values) {
    const current = editing && editing !== "new" ? editing : undefined;
    savePlan({ ...values, id: current?.id });
    message.success(current ? `Plan ${values.name} actualizado.` : `Plan ${values.name} creado.`);
    setEditing(null);
  }

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Planes</h1>
          <p>Bronce, Plata y Oro, más los planes a medida que necesites.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => open("new")}>
          Nuevo plan
        </Button>
      </div>
      <div className="plan-grid">
        {plans.map((plan) => {
          const active = subscriptions.filter(
            (item) => item.planId === plan.id && (item.status === "current" || item.status === "pending"),
          ).length;
          return (
            <Card key={plan.id} className={plan.active ? "plan-card" : "plan-card inactive"} style={{ borderTopColor: plan.color }}>
              <div className="incident-card-head">
                <h2>{plan.name}</h2>
                <div>
                  {plan.custom && <Tag color="purple">A medida</Tag>}
                  {!plan.active && <Tag>Inactivo</Tag>}
                </div>
              </div>
              <div className="plan-price">
                <strong>{formatMoney(plan.price)}</strong>
                <span>/ {periodLabel[plan.periodMonths]}</span>
              </div>
              <p>{plan.description}</p>
              <ul className="feature-list">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <CheckOutlined /> {feature}
                  </li>
                ))}
              </ul>
              <div className="plan-meta">
                <span>
                  <b>{active}</b> {active === 1 ? "suscripción activa" : "suscripciones activas"}
                </span>
                <span>
                  <b>{formatMoney(Math.round((active * plan.price) / plan.periodMonths))}</b> por mes
                </span>
              </div>
              <Button block onClick={() => open(plan)}>
                Editar plan
              </Button>
            </Card>
          );
        })}
      </div>
      <Modal
        title={editing === "new" ? "Nuevo plan" : "Editar plan"}
        open={editing !== null}
        onCancel={() => setEditing(null)}
        onOk={() => form.submit()}
        okText="Guardar"
        cancelText="Cancelar"
        forceRender
      >
        <Form form={form} layout="vertical" onFinish={save} style={{ marginTop: 12 }}>
          <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "Poné un nombre" }]}>
            <Input placeholder="Pretemporada, Club, Oro anual…" />
          </Form.Item>
          <div className="form-row">
            <Form.Item name="price" label="Precio (US$)" rules={[{ required: true, message: "Poné un precio" }]}>
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="periodMonths" label="Se cobra por">
              <Select
                options={[
                  { value: 1, label: "Mes" },
                  { value: 3, label: "Trimestre" },
                  { value: 12, label: "Año" },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item name="description" label="Descripción">
            <Input />
          </Form.Item>
          <Form.Item name="features" label="Qué incluye">
            <Select mode="tags" options={featureOptions} placeholder="Elegí o escribí" />
          </Form.Item>
          <div className="form-row">
            <Form.Item name="color" label="Color">
              <Select
                options={palette.map((item) => ({
                  value: item.value,
                  label: (
                    <span className="color-option">
                      <i style={{ background: item.value }} /> {item.label}
                    </span>
                  ),
                }))}
              />
            </Form.Item>
            <Form.Item name="active" label="Disponible para nuevas altas" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
