import { InboxOutlined } from "@ant-design/icons";
import { Alert, App, Button, Card, Select, Tag, Upload } from "antd";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMyAthletes, useUserName } from "../admin-store";
import { formatLong } from "../dates";
import { athleteName, athletes } from "../data/athletes";
import { PERSONA_USER } from "../data/platform";
import { useFollowup, type RoutineDraft } from "../followup-store";
import { exercisePrescription, parsePedroWorkbook, titleCase, type ParsedPlan } from "../import/parse-pedro";
export function ImportRoutinePage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { assignRoutine } = useFollowup();
  const coachName = useUserName()(PERSONA_USER.coach);
  const mine = useMyAthletes();
  const [plan, setPlan] = useState<ParsedPlan | null>(null);
  const [fileName, setFileName] = useState("");
  const [athleteId, setAthleteId] = useState<string>();
  const [reading, setReading] = useState(false);

  const matched = useMemo(() => {
    if (!plan?.athleteName) return undefined;
    const source = plan.athleteName.toLowerCase();
    return mine.find((athlete) => source.includes(athlete.firstName.toLowerCase()));
  }, [mine, plan]);

  async function read(file: File) {
    setReading(true);
    try {
      const parsed = await parsePedroWorkbook(await file.arrayBuffer());
      setPlan(parsed);
      setFileName(file.name);
      const source = parsed.athleteName?.toLowerCase() ?? "";
      const found = mine.find((athlete) => source.includes(athlete.firstName.toLowerCase()));
      setAthleteId(found?.id);
      if (parsed.days.length === 0) message.warning("No pude armar días de entrenamiento con este archivo.");
    } catch {
      message.error("No pude leer ese Excel. Tiene que ser la planilla de rutina.");
      setPlan(null);
    } finally {
      setReading(false);
    }
  }

  function confirm() {
    if (!plan || !athleteId) return;
    const planKey = `import-${Date.now()}`;
    const pause = plan.restNotes.length > 0 ? ` Pausas que figuran en la planilla: ${plan.restNotes.join(" · ")}.` : "";
    plan.days.forEach((day) => {
      const draft: RoutineDraft = {
        athleteId,
        coachId: PERSONA_USER.coach,
        date: day.date ?? plan.startDate ?? "",
        title: `${titleCase(day.weekday)} · fuerza`,
        weekday: titleCase(day.weekday),
        institution: plan.institution ?? undefined,
        period: plan.period ?? undefined,
        sourceName: plan.athleteName ?? fileName,
        planKey,
        note: `Importada de ${fileName}${plan.athleteName ? `, planilla de ${plan.athleteName}` : ""}.${plan.institution ? ` ${plan.institution}.` : ""}${plan.period ? ` Período ${plan.period}.` : ""}${pause}`,
        exercises: day.exercises.map((exercise) => ({
          name: exercise.name,
          prescription: exercisePrescription(exercise),
          code: exercise.code,
          block: exercise.block ?? undefined,
          sets: exercise.sets,
          note: exercise.note,
          videoUrl: exercise.videoUrl,
        })),
      };
      assignRoutine(draft, coachName);
    });
    const athlete = athletes.find((item) => item.id === athleteId);
    message.success(`Listo. ${plan.days.length} días quedaron en ${athlete ? athleteName(athlete) : "el deportista"}.`);
    navigate(`/app/planificacion?fecha=${plan.days[0]?.date ?? plan.startDate ?? ""}`);
  }

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Importar rutina</h1>
          <p>Lee la planilla del preparador físico y la convierte en entrenamientos para informar.</p>
        </div>
      </div>
      <Upload.Dragger
        accept=".xlsx"
        maxCount={1}
        showUploadList={false}
        beforeUpload={(file) => {
          void read(file);
          return false;
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">{reading ? "Leyendo…" : "Arrastrá el Excel o elegilo"}</p>
        <p className="ant-upload-hint">Usa la estructura de la planilla del club: nombre, período, fecha y los días con sus bloques.</p>
      </Upload.Dragger>

      {plan && (
        <div style={{ marginTop: 16 }}>
          <Card>
            <div className="import-head">
              <div>
                <b>{fileName}</b>
                <span>
                  {plan.athleteName ?? "Sin nombre"} · {plan.institution ?? "Sin institución"} · {plan.period ?? "Sin período"}
                  {plan.startDate ? ` · ${formatLong(plan.startDate)}` : ""}
                </span>
              </div>
              <Tag>{plan.days.length} días</Tag>
            </div>
            {plan.restNotes.length > 0 && (
              <p className="plan-note">Pausas de la planilla: {plan.restNotes.join(" · ")}</p>
            )}
            {plan.warnings.length > 0 && (
              <Alert
                type="warning"
                showIcon
                style={{ marginTop: 12 }}
                message={`${plan.warnings.length} ${plan.warnings.length === 1 ? "dato para revisar" : "datos para revisar"}`}
                description={
                  <ul className="warning-list">
                    {plan.warnings.slice(0, 8).map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                    {plan.warnings.length > 8 && <li>Y {plan.warnings.length - 8} más, del mismo tipo.</li>}
                  </ul>
                }
              />
            )}
            {!matched && plan.athleteName && (
              <Alert
                type="info"
                showIcon
                style={{ marginTop: 12 }}
                message={`“${plan.athleteName}” no coincide con un deportista del plantel. Elegí a quién asignarla.`}
              />
            )}
          </Card>

          {plan.days.map((day) => (
            <Card key={`${day.weekday}-${day.date}`} title={`${titleCase(day.weekday)}${day.date ? ` · ${formatLong(day.date)}` : ""}`} style={{ marginTop: 12 }}>
              <div className="block-list">
                {groupBlocks(day.exercises).map((group) => (
                  <section key={group.block}>
                    <h3>Bloque {group.block}</h3>
                    {group.exercises.map((exercise) => {
                      const ambiguous = plan.warnings.some((warning) => warning.includes(`“${exercise.name}”`));
                      return (
                        <div key={`${group.block}-${exercise.name}-${exercise.code ?? ""}`} className={ambiguous ? "import-exercise ambiguous" : "import-exercise"}>
                          <div>
                            <b>
                              {exercise.code ? `${exercise.code} · ` : ""}
                              {exercise.name}
                            </b>
                            <span>{exercisePrescription(exercise) || "Sin series ni indicaciones"}</span>
                          </div>
                          {exercise.videoUrl && (
                            <a href={exercise.videoUrl} target="_blank" rel="noreferrer">
                              Video
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </section>
                ))}
              </div>
            </Card>
          ))}

          <div className="import-confirm">
            <Select
              className="filter-select-wide"
              placeholder="Asignar a"
              value={athleteId}
              onChange={setAthleteId}
              options={mine.map((athlete) => ({ value: athlete.id, label: athleteName(athlete) }))}
            />
            <Button type="primary" disabled={!athleteId || plan.days.some((day) => !day.date)} onClick={confirm}>
              Incorporar a HORSE
            </Button>
            <Link to="/app/rutina">Volver</Link>
          </div>
        </div>
      )}
    </div>
  );
}

function groupBlocks<T extends { block: string | null }>(exercises: T[]) {
  const groups: Array<{ block: string; exercises: T[] }> = [];
  exercises.forEach((exercise) => {
    const block = exercise.block ?? "sin número";
    const current = groups[groups.length - 1];
    if (current?.block === block) current.exercises.push(exercise);
    else groups.push({ block, exercises: [exercise] });
  });
  return groups;
}
