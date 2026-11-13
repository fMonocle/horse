import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Button, DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";
import { addDays, formatShort, startOfWeek, toIso, weekLabel, weekdayShort } from "../dates";
import { athleteName, athletes } from "../data/athletes";
import { sessionTypes } from "../data/seed";
import { useTraining } from "../store";
import type { Session, SessionDraft } from "../types";

type FormValues = {
  athleteId: string;
  date: Dayjs;
  type: string;
  durationMin: number;
  notes: string;
};

export function PlanningPage() {
  const { sessions, addSession, toggleCompleted } = useTraining();
  const [offset, setOffset] = useState(0);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Session | null>(null);
  const [form] = Form.useForm<FormValues>();
  const monday = addDays(startOfWeek(new Date()), offset * 7);
  const days = Array.from({ length: 7 }, (_, index) => toIso(addDays(monday, index)));

  function openCreate(date?: string) {
    form.setFieldsValue({
      date: dayjs(date ?? toIso(monday)),
      durationMin: 60,
      notes: "",
    });
    setOpen(true);
  }

  function save(values: FormValues) {
    const draft: SessionDraft = {
      athleteId: values.athleteId,
      date: values.date.format("YYYY-MM-DD"),
      type: values.type,
      durationMin: values.durationMin,
      notes: values.notes ?? "",
    };
    addSession(draft);
    setOpen(false);
    form.resetFields();
  }

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Planificación</h1>
          <p>Las sesiones nuevas quedan en esta demostración, en la memoria del navegador.</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate()}>
          Nueva sesión
        </Button>
      </div>
      <div className="week-toolbar">
        <Button icon={<LeftOutlined />} onClick={() => setOffset((value) => value - 1)}>
          Semana anterior
        </Button>
        <b>{weekLabel(monday)}</b>
        <Button onClick={() => setOffset((value) => value + 1)}>
          Semana siguiente <RightOutlined />
        </Button>
      </div>
      <div className="week-grid">
        {days.map((date) => {
          const items = sessions
            .filter((session) => session.date === date)
            .sort((a, b) => a.athleteId.localeCompare(b.athleteId));
          return (
            <section className="day-column" key={date}>
              <header>
                <span>
                  {weekdayShort(date)} {formatShort(date)}
                </span>
                <Button size="small" type="text" icon={<PlusOutlined />} onClick={() => openCreate(date)} />
              </header>
              {items.map((session) => {
                const athlete = athletes.find((item) => item.id === session.athleteId);
                return (
                  <button
                    key={session.id}
                    type="button"
                    className={session.completed ? "session-chip done" : "session-chip"}
                    onClick={() => setSelected(session)}
                  >
                    <b>{athlete ? athleteName(athlete) : "Deportista"}</b>
                    <span>
                      {session.type} · {session.durationMin} min
                    </span>
                  </button>
                );
              })}
            </section>
          );
        })}
      </div>

      <Modal
        title="Nueva sesión"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        okText="Guardar"
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={save} style={{ marginTop: 12 }}>
          <Form.Item name="athleteId" label="Deportista" rules={[{ required: true, message: "Elegí un deportista" }]}>
            <Select
              options={athletes.map((athlete) => ({ value: athlete.id, label: athleteName(athlete) }))}
              placeholder="Elegir"
            />
          </Form.Item>
          <Form.Item name="date" label="Fecha" rules={[{ required: true, message: "Elegí una fecha" }]}>
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="type" label="Tipo de entrenamiento" rules={[{ required: true, message: "Elegí un tipo" }]}>
            <Select options={sessionTypes.map((type) => ({ value: type, label: type }))} />
          </Form.Item>
          <Form.Item name="durationMin" label="Duración (minutos)" rules={[{ required: true, message: "Indicá la duración" }]}>
            <InputNumber min={15} max={240} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="notes" label="Observaciones">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Sesión"
        open={selected !== null}
        onCancel={() => setSelected(null)}
        footer={[
          <Button key="close" onClick={() => setSelected(null)}>
            Cerrar
          </Button>,
          <Button
            key="toggle"
            type="primary"
            onClick={() => {
              if (!selected) return;
              toggleCompleted(selected.id);
              setSelected({ ...selected, completed: !selected.completed });
            }}
          >
            {selected?.completed ? "Volver a pendiente" : "Marcar como hecha"}
          </Button>,
        ]}
      >
        {selected && (
          <div>
            <p>
              <b>{athleteName(athletes.find((item) => item.id === selected.athleteId)!)}</b>
            </p>
            <p>
              {formatShort(selected.date)} · {selected.type} · {selected.durationMin} min
            </p>
            <p>{selected.notes || "Sin observaciones."}</p>
            <p style={{ color: "#5C6570" }}>{selected.completed ? "Hecha" : "Pendiente"}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
