import type { Athlete } from "../types";

export const DEMO_ATHLETE_ID = "a1";

export const athletes: Athlete[] = [
  {
    id: "a1",
    firstName: "Valentina",
    lastName: "Ruiz",
    country: "Argentina",
    sport: "Clavados",
    status: "available",
    goal: "Final continental en plataforma de 10 metros.",
    coachNote:
      "La entrada al agua viene más cerrada. El viernes repetimos la serie corta, sin sumar saltos.",
    metric: "Puntaje de ejecución",
    unit: "puntos",
  },
  {
    id: "a2",
    firstName: "Mateo",
    lastName: "Duarte",
    country: "Uruguay",
    sport: "Remo",
    status: "available",
    goal: "Bajar de 6:20 en el 2000 m antes del selectivo.",
    coachNote:
      "El segundo parcial salió 1,8 s más rápido. Mantenemos el mismo volumen.",
    metric: "Tiempo en 2000 m",
    unit: "segundos",
  },
  {
    id: "a3",
    firstName: "Camila",
    lastName: "Ferreira",
    country: "Brasil",
    sport: "Natación",
    status: "competition",
    goal: "Final B de 100 m libre en el campeonato sudamericano.",
    coachNote:
      "La salida sigue siendo el punto a pulir. El resto de la prueba está estable.",
    metric: "Tiempo en 100 m libre",
    unit: "segundos",
  },
  {
    id: "a4",
    firstName: "Ignacio",
    lastName: "Paredes",
    country: "Chile",
    sport: "Ciclismo de pista",
    status: "traveling",
    goal: "Clasificar la omnium del campeonato continental.",
    coachNote:
      "En el velódromo de visita hacemos una sola serie de calidad. El viaje no se llena de volumen.",
    metric: "Potencia media",
    unit: "W",
  },
  {
    id: "a5",
    firstName: "Lucía",
    lastName: "Benítez",
    country: "Paraguay",
    sport: "Equitación",
    status: "available",
    goal: "Recorrido limpio en la próxima fecha de salto.",
    coachNote:
      "Hoy no sumó faltas en la combinación. El jueves repetimos el mismo dibujo.",
    metric: "Faltas en el recorrido",
    unit: "faltas",
  },
  {
    id: "a6",
    firstName: "Andrés",
    lastName: "Quispe",
    country: "Perú",
    sport: "Esgrima",
    status: "available",
    goal: "Quedarse en el cuadro principal del open sudamericano.",
    coachNote:
      "El ataque en la preparación larga está saliendo. Dejamos la distancia como está.",
    metric: "Tocados a favor",
    unit: "tocados",
  },
  {
    id: "a7",
    firstName: "Martina",
    lastName: "Gómez",
    country: "Colombia",
    sport: "Judo",
    status: "competition",
    goal: "Medalla en 63 kg del campeonato panamericano.",
    coachNote:
      "Los dos randori de la mañana salieron al ritmo de competencia. A la tarde, técnico liviano.",
    metric: "Randori completados",
    unit: "series",
  },
  {
    id: "a8",
    firstName: "Sofía",
    lastName: "Almeida",
    country: "Ecuador",
    sport: "Vela",
    status: "traveling",
    goal: "Cerrar el ranking sudamericano dentro de las cinco primeras.",
    coachNote:
      "En el agua nueva priorizamos horas de lectura del viento, no series cortas.",
    metric: "Horas en el agua",
    unit: "h",
  },
];

export function athleteName(athlete: Pick<Athlete, "firstName" | "lastName">): string {
  return `${athlete.firstName} ${athlete.lastName}`;
}

export const statusLabel: Record<Athlete["status"], string> = {
  available: "Disponible",
  traveling: "De viaje",
  competition: "En competencia",
};
