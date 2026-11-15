import { ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Tag } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMyAthletes } from "../admin-store";
import { formatLong } from "../dates";
import { athleteName } from "../data/athletes";
import { feelingLabel } from "../data/followup";
import { useFollowup } from "../followup-store";
import type { ExerciseResult, RoutineExercise, SetLoad } from "../types";

export function RoutineComparePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { routines, reports, incidents } = useFollowup();
  const mine = useMyAthletes();
  const routine = routines.find((item) => item.id === id);
  const allowed = routine && mine.some((athlete) => athlete.id === routine.athleteId);
  const report = reports.find((item) => item.assignmentId === id);
  const incident = incidents.find((item) => item.reportId && item.reportId === report?.id);
  const athlete = mine.find((item) => item.id === routine?.athleteId);

  if (!routine || !allowed || !athlete) {
    return (
      <div className="page">
        <p>No encontramos esa rutina.</p>
        <Link to="/app/planificacion">Volver a planificación</Link>
      </div>
    );
  }

  const diffs = report ? differenceCount(routine.exercises, report.results) : 0;

  return (
    <div className="page narrow-page">
      <Button icon={<ArrowLeftOutlined />} type="text" onClick={() => navigate(`/app/deportistas/${athlete.id}`)} style={{ marginBottom: 8 }}>
        {athleteName(athlete)}
      </Button>
      <div className="page-title">
        <div>
          <h1>{routine.title}</h1>
          <p>
            {formatLong(routine.date)}
            {routine.sourceName ? ` · planilla de ${routine.sourceName}` : ""}
          </p>
        </div>
        <Tag color={routine.status === "reported" ? "green" : "blue"}>{routine.status === "reported" ? "Informada" : "Asignada"}</Tag>
      </div>
      {routine.note && <p className="plan-note">{routine.note}</p>}
      {!report && <Alert type="info" showIcon style={{ margin: "14px 0" }} message="El deportista todavía no informó este entrenamiento." />}
      {report && (
        <div className="report-facts" style={{ marginBottom: 14 }}>
          <span>
            Cómo se sintió <b>{feelingLabel[report.feeling]}</b>
          </span>
          <span>
            Esfuerzo <b>{report.effort} de 10</b>
          </span>
          <span>
            Cargas distintas <b>{diffs}</b>
          </span>
        </div>
      )}
      {report?.comment && <p className="plan-note">«{report.comment}»</p>}
      {report?.discomfort && (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 14 }}
          message={`Molestia en ${report.discomfort.zone.toLowerCase()}, intensidad ${report.discomfort.intensity} de 10`}
          description={report.discomfort.description}
        />
      )}
      {incident && (
        <Button style={{ marginBottom: 14 }} onClick={() => navigate(`/app/incidencias/${incident.id}`)}>
          Ver la incidencia
        </Button>
      )}
      <div className="block-list">
        {blocks(routine.exercises).map((group) => (
          <Card key={group.block} title={`Bloque ${group.block}`} style={{ marginTop: 12 }}>
            {group.exercises.map((exercise) => {
              const result = report?.results.find((item) => item.exerciseId === exercise.id);
              return <CompareExercise key={exercise.id} exercise={exercise} result={result} />;
            })}
          </Card>
        ))}
      </div>
    </div>
  );
}

function CompareExercise({ exercise, result }: { exercise: RoutineExercise; result?: ExerciseResult }) {
  const completion = result?.completion ?? (result ? (result.done ? "done" : "skipped") : undefined);
  const label = completion === "done" ? "Completo" : completion === "partial" ? "Parcial" : completion === "skipped" ? "No lo hizo" : "Sin informar";
  const color = completion === "done" ? "green" : completion === "partial" ? "gold" : completion === "skipped" ? "red" : "default";
  const planned = exercise.sets ?? [];
  const performed = result?.performedSets ?? [];
  return (
    <div className="import-exercise">
      <div className="incident-card-head">
        <b>
          {exercise.code ? `${exercise.code} · ` : ""}
          {exercise.name}
        </b>
        <Tag color={color}>{label}</Tag>
      </div>
      {exercise.note && <span>{exercise.note}</span>}
      {planned.length > 0 && (
        <div className="set-compare">
          {planned.map((set, index) => (
            <SetRow key={index} index={index + 1} planned={set} performed={performed[index]} informed={Boolean(result)} />
          ))}
        </div>
      )}
      {planned.length === 0 && <span>{exercise.prescription}</span>}
      {result?.result && <span>Comentario: {result.result}</span>}
      {exercise.videoUrl && (
        <a href={exercise.videoUrl} target="_blank" rel="noreferrer">
          Video
        </a>
      )}
    </div>
  );
}

function SetRow({ index, planned, performed, informed }: { index: number; planned: SetLoad; performed?: SetLoad; informed: boolean }) {
  const loadDiff = informed && performed && performed.load.trim() !== planned.load.trim();
  const repsDiff = informed && performed && performed.reps.trim() !== planned.reps.trim();
  return (
    <div className="set-compare-row">
      <b>Serie {index}</b>
      <span>Plan {showSet(planned)}</span>
      <span className={loadDiff || repsDiff ? "diff" : ""}>{informed ? `Hizo ${performed ? showSet(performed) : "sin dato"}` : "Sin informar"}</span>
    </div>
  );
}

function showSet(set: SetLoad): string {
  const load = /^\d+(,\d+)?$/.test(set.load) ? `${set.load} kg` : set.load;
  if (load && set.reps) return `${load} × ${set.reps}`;
  return load || set.reps || "sin dato";
}

function differenceCount(exercises: RoutineExercise[], results: ExerciseResult[]): number {
  return exercises.reduce((total, exercise) => {
    const result = results.find((item) => item.exerciseId === exercise.id);
    if (!result?.performedSets) return total;
    return (
      total +
      (exercise.sets ?? []).filter((set, index) => {
        const done = result.performedSets?.[index];
        return done && (done.load.trim() !== set.load.trim() || done.reps.trim() !== set.reps.trim());
      }).length
    );
  }, 0);
}

function blocks(exercises: RoutineExercise[]) {
  const groups: Array<{ block: string; exercises: RoutineExercise[] }> = [];
  exercises.forEach((exercise) => {
    const block = exercise.block ?? "sin número";
    const current = groups[groups.length - 1];
    if (current?.block === block) current.exercises.push(exercise);
    else groups.push({ block, exercises: [exercise] });
  });
  return groups;
}
