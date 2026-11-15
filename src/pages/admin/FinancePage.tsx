import { PlusOutlined } from "@ant-design/icons";
import { App, Button, Card, DatePicker, Form, Input, InputNumber, Modal, Progress, Radio, Segmented, Select, Table, Tabs, Tag } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdmin } from "../../admin-store";
import { formatShort, lastMonthKeys, monthKey, monthLabel, todayIso } from "../../dates";
import { formatMoney, movementCategories } from "../../data/platform";
import { cellLabel, currentMonth, monthlySeries, pendingTotal, planDistribution } from "../../finance";
import type { Movement, MovementKind } from "../../types";

type Values = {
  kind: MovementKind;
  date: Dayjs;
  category: string;
  description: string;
  amount: number;
  status: Movement["status"];
};

export function FinancePage() {
  const { movements, subscriptions, plans, addMovement, markPaid } = useAdmin();
  const { message } = App.useApp();
  const [form] = Form.useForm<Values>();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<MovementKind | "all">("all");
  const [status, setStatus] = useState<Movement["status"]>();
  const [month, setMonth] = useState<string>();
  const formKind = Form.useWatch("kind", form) ?? "income";

  const now = currentMonth(movements);
  const series = monthlySeries(movements);
  const distribution = planDistribution(subscriptions, plans);
  const months = lastMonthKeys(6).reverse();
  const pendingIncome = movements.filter((item) => item.kind === "income" && item.status === "pending");
  const pendingExpense = movements.filter((item) => item.kind === "expense" && item.status === "pending");
  const rate = now.billed === 0 ? 100 : Math.round((now.collected / now.billed) * 100);
  const expenseByCategory = Object.entries(
    movements
      .filter((item) => item.kind === "expense" && item.status === "paid" && monthKey(item.date) === now.key)
      .reduce<Record<string, number>>((acc, item) => ({ ...acc, [item.category]: (acc[item.category] ?? 0) + item.amount }), {}),
  ).sort((a, b) => b[1] - a[1]);
  const expenseTotal = expenseByCategory.reduce((total, [, value]) => total + value, 0) || 1;

  const rows = movements.filter(
    (item) =>
      (kind === "all" || item.kind === kind) &&
      (!status || item.status === status) &&
      (!month || monthKey(item.date) === month),
  );

  function openForm() {
    form.setFieldsValue({ kind: "expense", date: dayjs(), category: "Equipamiento", description: "", amount: undefined, status: "paid" });
    setOpen(true);
  }

  function save(values: Values) {
    addMovement({
      kind: values.kind,
      date: values.date.format("YYYY-MM-DD"),
      category: values.category,
      description: values.description.trim() || values.category,
      amount: values.amount,
      status: values.status,
    });
    message.success("Movimiento registrado.");
    setOpen(false);
  }

  const settle = (item: Movement) => {
    markPaid(item.id);
    message.success(item.kind === "income" ? "Cobro registrado." : "Pago registrado.");
  };

  const pendingList = (items: Movement[], action: string) => (
    <div className="mini-list">
      {items.length === 0 && <p style={{ color: "#5c6570", margin: 0 }}>No hay pendientes.</p>}
      {items.map((item) => (
        <div key={item.id} className="routine-row">
          <div>
            <b>{item.description}</b>
            <span>
              {formatShort(item.date)} · {formatMoney(item.amount)}
              {item.date < todayIso() ? " · vencido" : ""}
            </span>
          </div>
          <Button size="small" type="primary" onClick={() => settle(item)}>
            {action}
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Finanzas</h1>
          <p>Ingresos, egresos, cobranza y reportes por plan.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openForm}>
          Registrar movimiento
        </Button>
      </div>
      <div className="stat-grid">
        <article className="stat-card tone-done">
          <span>Ingresos del mes</span>
          <strong>{formatMoney(now.income)}</strong>
        </article>
        <article className="stat-card tone-pending">
          <span>Egresos del mes</span>
          <strong>{formatMoney(now.expense)}</strong>
        </article>
        <article className="stat-card tone-athletes">
          <span>Balance del mes</span>
          <strong>{formatMoney(now.balance)}</strong>
        </article>
        <article className="stat-card tone-alert">
          <span>Por cobrar</span>
          <strong>{formatMoney(pendingTotal(movements, "income"))}</strong>
        </article>
      </div>
      <Tabs
        items={[
          {
            key: "summary",
            label: "Resumen",
            children: (
              <div className="two-col">
                <Card title="Últimos seis meses">
                  <div className="chart-box" style={{ height: 280 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={series}>
                        <CartesianGrid stroke="#E6E8EE" vertical={false} />
                        <XAxis dataKey="label" tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "#5C6570", fontSize: 12 }} axisLine={false} tickLine={false} width={56} />
                        <Tooltip
                          formatter={(value, name) => [
                            formatMoney(Number(value)),
                            name === "income" ? "Ingresos" : name === "expense" ? "Egresos" : "Balance",
                          ]}
                        />
                        <Legend formatter={(value) => (value === "income" ? "Ingresos" : value === "expense" ? "Egresos" : "Balance")} />
                        <Bar dataKey="income" fill="#2F6BFF" radius={[6, 6, 0, 0]} maxBarSize={22} />
                        <Bar dataKey="expense" fill="#C9CFDA" radius={[6, 6, 0, 0]} maxBarSize={22} />
                        <Bar dataKey="balance" fill="#2F6B45" radius={[6, 6, 0, 0]} maxBarSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
                <Card title={`Egresos de ${monthLabel(now.key)}`}>
                  <div className="mini-list">
                    {expenseByCategory.map(([category, value]) => (
                      <div key={category}>
                        <div className="routine-row" style={{ paddingBottom: 2 }}>
                          <b>{category}</b>
                          <span>{formatMoney(value)}</span>
                        </div>
                        <Progress percent={Math.round((value / expenseTotal) * 100)} showInfo={false} strokeColor="#2F6BFF" size="small" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ),
          },
          {
            key: "movements",
            label: "Movimientos",
            children: (
              <>
                <div className="filters">
                  <Segmented
                    value={kind}
                    onChange={(value) => setKind(value as MovementKind | "all")}
                    options={[
                      { label: "Todos", value: "all" },
                      { label: "Ingresos", value: "income" },
                      { label: "Egresos", value: "expense" },
                    ]}
                  />
                  <Select allowClear className="filter-select" placeholder="Estado" value={status} onChange={setStatus} options={[{ value: "paid", label: "Cobrado o pagado" }, { value: "pending", label: "Pendiente" }]} />
                  <Select allowClear className="filter-select" placeholder="Mes" value={month} onChange={setMonth} options={months.map((key) => ({ value: key, label: monthLabel(key) }))} />
                </div>
                <Table
                  className="stack-table"
                  rowKey="id"
                  dataSource={rows}
                  pagination={{ pageSize: 10, hideOnSinglePage: true }}
                  scroll={{ x: true }}
                  columns={[
                    { title: "Fecha", dataIndex: "date", onCell: () => cellLabel("Fecha"), render: (value: string) => formatShort(value) },
                    { title: "Concepto", dataIndex: "description", onCell: () => cellLabel("Concepto") },
                    { title: "Categoría", dataIndex: "category", onCell: () => cellLabel("Categoría"), render: (value: string) => <Tag>{value}</Tag> },
                    {
                      title: "Monto",
                      onCell: () => cellLabel("Monto"),
                      render: (_, item) => (
                        <b style={{ color: item.kind === "income" ? "#2f6b45" : "#12151c" }}>
                          {item.kind === "income" ? "+" : "−"} {formatMoney(item.amount)}
                        </b>
                      ),
                    },
                    {
                      title: "Estado",
                      onCell: () => cellLabel("Estado"),
                      render: (_, item) =>
                        item.status === "paid" ? (
                          <Tag color="green">{item.kind === "income" ? "Cobrado" : "Pagado"}</Tag>
                        ) : (
                          <Button size="small" onClick={() => settle(item)}>
                            {item.kind === "income" ? "Registrar cobro" : "Marcar pagado"}
                          </Button>
                        ),
                    },
                  ]}
                />
              </>
            ),
          },
          {
            key: "collection",
            label: "Cobranza",
            children: (
              <div className="two-col">
                <Card title="Cobros pendientes">
                  <div className="collection-rate">
                    <Progress type="circle" percent={rate} size={88} strokeColor="#2F6BFF" />
                    <div>
                      <b>Cobranza de {monthLabel(now.key)}</b>
                      <span>
                        {formatMoney(now.collected)} cobrados de {formatMoney(now.billed)} facturados.
                      </span>
                    </div>
                  </div>
                  {pendingList(pendingIncome, "Registrar cobro")}
                </Card>
                <Card title="Pagos a realizar">{pendingList(pendingExpense, "Marcar pagado")}</Card>
              </div>
            ),
          },
          {
            key: "reports",
            label: "Reportes",
            children: (
              <div className="two-col">
                <Card title="Distribución por plan">
                  <div className="chart-box" style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={distribution} dataKey="monthly" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                          {distribution.map((row) => (
                            <Cell key={row.id} fill={row.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${formatMoney(Number(value))} por mes`, name]} />
                        <Legend verticalAlign="bottom" iconType="circle" />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <Table
                    className="stack-table"
                    rowKey="id"
                    size="small"
                    pagination={false}
                    dataSource={distribution}
                    columns={[
                      { title: "Plan", dataIndex: "name", onCell: () => cellLabel("Plan") },
                      { title: "Activas", dataIndex: "count", onCell: () => cellLabel("Activas") },
                      { title: "Por mes", dataIndex: "monthly", onCell: () => cellLabel("Por mes"), render: (value: number) => formatMoney(value) },
                      { title: "Participación", dataIndex: "share", onCell: () => cellLabel("Participación"), render: (value: number) => `${value}%` },
                    ]}
                  />
                </Card>
                <Card title="Cobranza por mes">
                  <Table
                    className="stack-table"
                    rowKey="key"
                    size="small"
                    pagination={false}
                    dataSource={[...series].reverse()}
                    columns={[
                      { title: "Mes", dataIndex: "label", onCell: () => cellLabel("Mes") },
                      { title: "Facturado", dataIndex: "billed", onCell: () => cellLabel("Facturado"), render: (value: number) => formatMoney(value) },
                      { title: "Cobrado", dataIndex: "collected", onCell: () => cellLabel("Cobrado"), render: (value: number) => formatMoney(value) },
                      { title: "Pendiente", dataIndex: "pendingIncome", onCell: () => cellLabel("Pendiente"), render: (value: number) => formatMoney(value) },
                      {
                        title: "Cobranza",
                        onCell: () => cellLabel("Cobranza"),
                        render: (_, row) => `${row.billed === 0 ? 100 : Math.round((row.collected / row.billed) * 100)}%`,
                      },
                    ]}
                  />
                </Card>
              </div>
            ),
          },
        ]}
      />
      <Modal
        title="Registrar movimiento"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Guardar"
        cancelText="Cancelar"
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={save}
          style={{ marginTop: 12 }}
          onValuesChange={(changed) => {
            if (changed.kind) form.setFieldValue("category", movementCategories[changed.kind as MovementKind][0]);
          }}
        >
          <Form.Item name="kind" label="Tipo">
            <Radio.Group optionType="button" options={[{ value: "income", label: "Ingreso" }, { value: "expense", label: "Egreso" }]} />
          </Form.Item>
          <div className="form-row">
            <Form.Item name="date" label="Fecha" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="amount" label="Monto (US$)" rules={[{ required: true, message: "Poné el monto" }]}>
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </div>
          <Form.Item name="category" label="Categoría">
            <Select options={movementCategories[formKind as MovementKind].map((value) => ({ value, label: value }))} />
          </Form.Item>
          <Form.Item name="description" label="Concepto">
            <Input placeholder="Compra de bandas elásticas" />
          </Form.Item>
          <Form.Item name="status" label="Estado">
            <Radio.Group
              optionType="button"
              options={[
                { value: "paid", label: formKind === "income" ? "Cobrado" : "Pagado" },
                { value: "pending", label: "Pendiente" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
