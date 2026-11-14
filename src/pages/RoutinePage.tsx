import { Select } from "antd";
import { useMemo, useState } from "react";
import { rutinaExercises, type RutinaSet } from "../data/rutina-excel";

const numberFormat = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 });

function formatKg(value: number): string {
  return `${numberFormat.format(value)} kg`;
}

function formatSet(set: RutinaSet): string {
  return `${numberFormat.format(set.percent)}% · ${formatKg(set.kg)} × ${set.reps}`;
}

export function RoutinePage() {
  const [name, setName] = useState(rutinaExercises[0].name);
  const exercise = useMemo(
    () => rutinaExercises.find((item) => item.name === name) ?? rutinaExercises[0],
    [name],
  );

  return (
    <div className="page">
      <div className="page-title">
        <div>
          <h1>Rutina de Lucas</h1>
          <p>Ejercicios con referencia de carga y kilos calculados por sesión.</p>
        </div>
        <Select
          className="routine-select"
          value={exercise.name}
          options={rutinaExercises.map((item) => ({
            value: item.name,
            label: `${item.name} · ${item.sessions.length}`,
          }))}
          onChange={setName}
        />
      </div>
      <section className="day-plan">
        <h2>Referencia {formatKg(exercise.referenceKg)}</h2>
        <div className="excel-table">
          <div className="excel-row excel-head">
            <span>Código</span>
            <span>Día</span>
            <span>Series</span>
            <span>IMR</span>
            <span>Tonelaje</span>
            <span>Reps</span>
            <span>Peso medio</span>
          </div>
          {exercise.sessions.map((session) => (
            <div className="excel-row" key={session.code}>
              <b data-label="Código">{session.code}</b>
              <span data-label="Día">{session.day ?? "Sin día"}</span>
              <span className="excel-sets" data-label="Series">
                {session.sets.map((set, index) => (
                  <em key={index}>{formatSet(set)}</em>
                ))}
              </span>
              <span data-label="IMR">{numberFormat.format(session.imr)}</span>
              <span data-label="Tonelaje">{formatKg(session.tonnage)}</span>
              <span data-label="Reps">{session.reps}</span>
              <span data-label="Peso medio">{formatKg(session.avgKg)}</span>
            </div>
          ))}
        </div>
      </section>
      <p className="plan-summary">
        Sentadilla, peso muerto, tirones y arranque no tienen referencia de carga, así que no se muestran.
      </p>
    </div>
  );
}
