import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Button, DatePicker, Form, Input, Modal, Select } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect } from "react";
import { useMyAthletes, useUserName } from "../admin-store";
import { athleteName, athletes } from "../data/athletes";
import { PERSONA_USER } from "../data/platform";
import { useFollowup } from "../followup-store";

type Values = {
  athleteId: string;
  date: Dayjs;
  title: string;
  note: string;
  exercises: Array<{ name: string; prescription: string }>;
};

export function AssignRoutineModal({
  open,
  onClose,
  defaultAthleteId,
  defaultTitle,
  defaultExercises,
}: {
  open: boolean;
  onClose: () => void;
  defaultAthleteId?: string;
  defaultTitle?: string;
  defaultExercises?: Array<{ name: string; prescription: string }>;
}) {
  const [form] = Form.useForm<Values>();
  const { assignRoutine } = useFollowup();
  const { message } = App.useApp();
  const myAthletes = useMyAthletes();
  const userName = useUserName();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({
      athleteId: defaultAthleteId,
      date: dayjs().add(1, "day"),
      title: defaultTitle ?? "",
      note: "",
      exercises: defaultExercises?.length ? defaultExercises : [{ name: "", prescription: "" }],
    });
  }, [defaultAthleteId, defaultExercises, defaultTitle, form, open]);

  function save(values: Values) {
    const exercises = values.exercises.filter((exercise) => exercise?.name?.trim());
    assignRoutine(
      {
        athleteId: values.athleteId,
        coachId: PERSONA_USER.coach,
        date: values.date.format("YYYY-MM-DD"),
        title: values.title.trim(),
        note: values.note ?? "",
        exercises: exercises.map((exercise) => ({
          name: exercise.name.trim(),
          prescription: exercise.prescription?.trim() ?? "",
        })),
      },
      userName(PERSONA_USER.coach),
    );
    const athlete = athletes.find((item) => item.id === values.athleteId);
    message.success(`Rutina asignada a ${athlete ? athleteName(athlete) : "el deportista"}.`);
    onClose();
  }

  return (
    <Modal
      title="Asignar rutina"
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Asignar"
      cancelText="Cancelar"
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={save} style={{ marginTop: 12 }}>
        <Form.Item name="athleteId" label="Deportista" rules={[{ required: true, message: "Elegí un deportista" }]}>
          <Select
            placeholder="Elegir"
            options={myAthletes.map((athlete) => ({ value: athlete.id, label: athleteName(athlete) }))}
          />
        </Form.Item>
        <div className="form-row">
          <Form.Item name="date" label="Fecha" rules={[{ required: true, message: "Elegí una fecha" }]}>
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="title" label="Nombre de la rutina" rules={[{ required: true, message: "Poné un nombre" }]}>
            <Input placeholder="Fuerza y core" />
          </Form.Item>
        </div>
        <Form.List name="exercises">
          {(fields, { add, remove }) => (
            <div className="exercise-list">
              <span className="field-label">Ejercicios</span>
              {fields.map((field) => (
                <div className="exercise-line" key={field.key}>
                  <Form.Item name={[field.name, "name"]} rules={[{ required: true, message: "Falta el ejercicio" }]}>
                    <Input placeholder="Ejercicio" />
                  </Form.Item>
                  <Form.Item name={[field.name, "prescription"]}>
                    <Input placeholder="Series, repeticiones y carga" />
                  </Form.Item>
                  <Button
                    aria-label="Quitar ejercicio"
                    icon={<DeleteOutlined />}
                    disabled={fields.length === 1}
                    onClick={() => remove(field.name)}
                  />
                </div>
              ))}
              <Button icon={<PlusOutlined />} onClick={() => add({ name: "", prescription: "" })}>
                Agregar ejercicio
              </Button>
            </div>
          )}
        </Form.List>
        <Form.Item name="note" label="Indicaciones" style={{ marginTop: 16 }}>
          <Input.TextArea rows={2} placeholder="Lo que el deportista tiene que tener en cuenta" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
