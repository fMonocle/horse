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
          <p>Seis ejercicios con kilos calculados. El resto del archivo no tiene referencia y la cuenta da cero.</p>
        </div>
        <Select
          value={exercise.name}
          style={{ minWidth: 280 }}
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
              <b>{session.code}</b>
              <span>{session.day ?? "Sin día"}</span>
              <span className="excel-sets">
                {session.sets.map((set, index) => (
                  <em key={index}>{formatSet(set)}</em>
                ))}
              </span>
              <span>{numberFormat.format(session.imr)}</span>
              <span>{formatKg(session.tonnage)}</span>
              <span>{session.reps}</span>
              <span>{formatKg(session.avgKg)}</span>
            </div>
          ))}
        </div>
      </section>
      <p className="plan-summary">
        En el Excel también hay sentadilla, peso muerto, tirones y otras filas de cargadas y arranque. Esas filas no tienen la referencia cargada, así que el kilo calculado es cero y no las muestro como carga.
      </p>
    </div>
  );
}
