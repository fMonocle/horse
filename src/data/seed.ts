import { addDays, startOfWeek, toIso } from "../dates";
import type { Measurement, Session } from "../types";
import { athletes } from "./athletes";

const monday = startOfWeek(new Date());

function day(offset: number): string {
  return toIso(addDays(monday, offset));
}

function weeksAgo(weeks: number): string {
  return toIso(addDays(monday, -7 * weeks));
}

const currentWeek: Array<Omit<Session, "id">> = [
  { athleteId: "a1", date: day(0), type: "Agua técnica", durationMin: 70, notes: "Entradas desde 5 y 7,5 m. Serie corta.", completed: true },
  { athleteId: "a1", date: day(2), type: "Trampolín", durationMin: 45, notes: "Cuatro saltos de la serie de competencia.", completed: true },
  { athleteId: "a1", date: day(4), type: "Simulación", durationMin: 40, notes: "Serie completa, una sola pasada.", completed: false },
  { athleteId: "a2", date: day(0), type: "Agua", durationMin: 80, notes: "2000 m en parciales de 500.", completed: true },
  { athleteId: "a2", date: day(2), type: "Agua", durationMin: 75, notes: "Ritmo de selectivo, sin cierre.", completed: true },
  { athleteId: "a2", date: day(4), type: "Gimnasio", durationMin: 50, notes: "Fuerza general, sin test.", completed: false },
  { athleteId: "a3", date: day(1), type: "Agua", durationMin: 90, notes: "Salidas y primeros 15 m.", completed: true },
  { athleteId: "a3", date: day(3), type: "Agua", durationMin: 60, notes: "Dos 100 m con partida.", completed: false },
  { athleteId: "a4", date: day(1), type: "Pista", durationMin: 55, notes: "Una serie de calidad en el velódromo de visita.", completed: true },
  { athleteId: "a4", date: day(5), type: "Rodillo", durationMin: 40, notes: "Movilidad y cadencia, sin series.", completed: false },
  { athleteId: "a5", date: day(0), type: "Salto", durationMin: 50, notes: "Mismo dibujo de la fecha anterior.", completed: true },
  { athleteId: "a5", date: day(3), type: "Plano", durationMin: 40, notes: "Trabajo de combinación, sin altura.", completed: false },
  { athleteId: "a6", date: day(1), type: "Asalto", durationMin: 60, notes: "Preparación larga y distancia.", completed: true },
  { athleteId: "a6", date: day(4), type: "Técnico", durationMin: 45, notes: "Pie y arma, sin combate.", completed: false },
  { athleteId: "a7", date: day(0), type: "Randori", durationMin: 70, notes: "Dos combates al ritmo de competencia.", completed: true },
  { athleteId: "a7", date: day(2), type: "Técnico", durationMin: 40, notes: "Uchikomi liviano.", completed: true },
  { athleteId: "a8", date: day(2), type: "Agua", durationMin: 120, notes: "Lectura de viento en la bahía nueva.", completed: false },
  { athleteId: "a8", date: day(5), type: "Agua", durationMin: 90, notes: "Segunda salida, mismo recorrido.", completed: false },
];

function olderSessions(): Array<Omit<Session, "id">> {
  const rows: Array<Omit<Session, "id">> = [];
  for (let week = 1; week <= 6; week += 1) {
    athletes.forEach((athlete, index) => {
      const offsets = [0, 2, 4];
      offsets.forEach((offset, sessionIndex) => {
        const completed = (week + index + sessionIndex) % 5 !== 0;
        rows.push({
          athleteId: athlete.id,
          date: toIso(addDays(monday, -7 * week + offset)),
          type: sessionIndex === 2 ? "Técnico" : "Entrenamiento",
          durationMin: 45 + ((index + sessionIndex) % 3) * 15,
          notes: "Sesión de la planificación de esa semana.",
          completed,
        });
      });
    });
  }
  return rows;
}

export const initialSessions: Session[] = [...currentWeek, ...olderSessions()].map(
  (session, index) => ({ ...session, id: `s${index + 1}` }),
);

const series: Record<string, number[]> = {
  a1: [74, 76, 75, 79, 81, 80, 84, 86],
  a2: [392, 389, 388, 386, 384, 383, 381, 379],
  a3: [56.4, 56.1, 56.2, 55.8, 55.6, 55.7, 55.3, 55.1],
  a4: [310, 318, 322, 315, 330, 336, 340, 348],
  a5: [8, 6, 7, 4, 4, 3, 2, 1],
  a6: [9, 10, 11, 10, 12, 13, 12, 14],
  a7: [4, 4, 5, 5, 6, 5, 6, 6],
  a8: [3, 4, 4, 5, 5, 6, 6, 7],
};

export const measurements: Measurement[] = Object.entries(series).flatMap(
  ([athleteId, values]) =>
    values.map((value, index) => ({
      athleteId,
      date: weeksAgo(values.length - 1 - index),
      value,
    })),
);

export const sessionTypes = [
  "Agua",
  "Agua técnica",
  "Pista",
  "Rodillo",
  "Gimnasio",
  "Técnico",
  "Salto",
  "Plano",
  "Randori",
  "Asalto",
  "Trampolín",
  "Simulación",
  "Entrenamiento",
];
