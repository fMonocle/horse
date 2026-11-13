export type RutinaSet = { percent: number; reps: number; kg: number };
export type LucasSession = {
  code: string;
  day: string | null;
  sets: RutinaSet[];
  imr: number;
  tonnage: number;
  reps: number;
  avgKg: number;
};
export type LucasExercise = {
  name: string;
  referenceKg: number;
  sessions: LucasSession[];
};

export const rutinaExercises: LucasExercise[] = [
  {
    "name": "SUBIDA A 2-4 CAJ EXP",
    "referenceKg": 210,
    "sessions": [
      {
        "code": "S1",
        "day": "Martes",
        "sets": [
          {
            "percent": 19,
            "reps": 3,
            "kg": 39.9
          },
          {
            "percent": 26,
            "reps": 1,
            "kg": 54.6
          },
          {
            "percent": 26,
            "reps": 1,
            "kg": 54.6
          },
          {
            "percent": 26,
            "reps": 1,
            "kg": 54.6
          }
        ],
        "imr": 22.5,
        "tonnage": 283.5,
        "reps": 6,
        "avgKg": 47.2
      },
      {
        "code": "S5",
        "day": "Martes",
        "sets": [
          {
            "percent": 19,
            "reps": 3,
            "kg": 39.9
          },
          {
            "percent": 24,
            "reps": 1,
            "kg": 50.4
          },
          {
            "percent": 28.5,
            "reps": 1,
            "kg": 59.8
          },
          {
            "percent": 28.5,
            "reps": 1,
            "kg": 59.8
          }
        ],
        "imr": 23.0,
        "tonnage": 289.8,
        "reps": 6,
        "avgKg": 48.3
      },
      {
        "code": "S10",
        "day": "Lunes",
        "sets": [
          {
            "percent": 19,
            "reps": 3,
            "kg": 39.9
          },
          {
            "percent": 24,
            "reps": 1,
            "kg": 50.4
          },
          {
            "percent": 28.5,
            "reps": 1,
            "kg": 59.8
          },
          {
            "percent": 33.2,
            "reps": 1,
            "kg": 69.7
          }
        ],
        "imr": 23.8,
        "tonnage": 299.7,
        "reps": 6,
        "avgKg": 49.9
      },
      {
        "code": "S12",
        "day": null,
        "sets": [
          {
            "percent": 19,
            "reps": 3,
            "kg": 39.9
          },
          {
            "percent": 24,
            "reps": 2,
            "kg": 50.4
          },
          {
            "percent": 28.5,
            "reps": 2,
            "kg": 59.8
          },
          {
            "percent": 28.5,
            "reps": 1,
            "kg": 59.8
          },
          {
            "percent": 28.5,
            "reps": 1,
            "kg": 59.8
          }
        ],
        "imr": 24.3,
        "tonnage": 459.9,
        "reps": 9,
        "avgKg": 51.1
      },
      {
        "code": "S14",
        "day": "Lunes",
        "sets": [
          {
            "percent": 21.5,
            "reps": 2,
            "kg": 45.1
          },
          {
            "percent": 28.5,
            "reps": 2,
            "kg": 59.8
          },
          {
            "percent": 28.5,
            "reps": 2,
            "kg": 59.8
          },
          {
            "percent": 28.5,
            "reps": 2,
            "kg": 59.8
          }
        ],
        "imr": 26.7,
        "tonnage": 449.4,
        "reps": 8,
        "avgKg": 56.2
      },
      {
        "code": "S16",
        "day": "Lunes",
        "sets": [
          {
            "percent": 24,
            "reps": 2,
            "kg": 50.4
          },
          {
            "percent": 33.5,
            "reps": 1,
            "kg": 70.4
          },
          {
            "percent": 33.5,
            "reps": 1,
            "kg": 70.4
          },
          {
            "percent": 33.5,
            "reps": 1,
            "kg": 70.4
          }
        ],
        "imr": 29.7,
        "tonnage": 311.9,
        "reps": 5,
        "avgKg": 62.4
      }
    ]
  },
  {
    "name": "SUBIDA A 2-4-6 CAJ EXP",
    "referenceKg": 210,
    "sessions": [
      {
        "code": "S2",
        "day": "Lunes",
        "sets": [
          {
            "percent": 24,
            "reps": 2,
            "kg": 50.4
          },
          {
            "percent": 24,
            "reps": 2,
            "kg": 50.4
          },
          {
            "percent": 24,
            "reps": 2,
            "kg": 50.4
          }
        ],
        "imr": 24.0,
        "tonnage": 302.4,
        "reps": 6,
        "avgKg": 50.4
      },
      {
        "code": "S4",
        "day": "Lunes",
        "sets": [
          {
            "percent": 19,
            "reps": 3,
            "kg": 39.9
          },
          {
            "percent": 26,
            "reps": 1,
            "kg": 54.6
          },
          {
            "percent": 26,
            "reps": 1,
            "kg": 54.6
          },
          {
            "percent": 26,
            "reps": 1,
            "kg": 54.6
          }
        ],
        "imr": 22.5,
        "tonnage": 283.5,
        "reps": 6,
        "avgKg": 47.2
      },
      {
        "code": "S6",
        "day": "Lunes",
        "sets": [
          {
            "percent": 19,
            "reps": 3,
            "kg": 39.9
          },
          {
            "percent": 26,
            "reps": 2,
            "kg": 54.6
          },
          {
            "percent": 26,
            "reps": 2,
            "kg": 54.6
          },
          {
            "percent": 26,
            "reps": 2,
            "kg": 54.6
          }
        ],
        "imr": 23.7,
        "tonnage": 447.3,
        "reps": 9,
        "avgKg": 49.7
      }
    ]
  },
  {
    "name": "CARGADAS",
    "referenceKg": 90,
    "sessions": [
      {
        "code": "a1",
        "day": "Lunes",
        "sets": [
          {
            "percent": 33,
            "reps": 3,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 3,
            "kg": 39.6
          },
          {
            "percent": 56,
            "reps": 3,
            "kg": 50.4
          },
          {
            "percent": 72,
            "reps": 2,
            "kg": 64.8
          },
          {
            "percent": 72,
            "reps": 2,
            "kg": 64.8
          },
          {
            "percent": 72,
            "reps": 2,
            "kg": 64.8
          },
          {
            "percent": 72,
            "reps": 2,
            "kg": 64.8
          }
        ],
        "imr": 57.4,
        "tonnage": 877.5,
        "reps": 17,
        "avgKg": 51.6
      },
      {
        "code": "a2",
        "day": "Viernes",
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          }
        ],
        "imr": 52.0,
        "tonnage": 936.0,
        "reps": 20,
        "avgKg": 46.8
      },
      {
        "code": "a3",
        "day": "Lunes",
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          },
          {
            "percent": 72,
            "reps": 3,
            "kg": 64.8
          },
          {
            "percent": 72,
            "reps": 3,
            "kg": 64.8
          },
          {
            "percent": 72,
            "reps": 3,
            "kg": 64.8
          }
        ],
        "imr": 57.1,
        "tonnage": 1080.0,
        "reps": 21,
        "avgKg": 51.4
      },
      {
        "code": "a4",
        "day": "Viernes",
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          },
          {
            "percent": 67,
            "reps": 2,
            "kg": 60.3
          },
          {
            "percent": 67,
            "reps": 2,
            "kg": 60.3
          }
        ],
        "imr": 51.3,
        "tonnage": 738.0,
        "reps": 16,
        "avgKg": 46.1
      },
      {
        "code": "a5",
        "day": "Lunes",
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          },
          {
            "percent": 80,
            "reps": 1,
            "kg": 72
          },
          {
            "percent": 80,
            "reps": 1,
            "kg": 72
          },
          {
            "percent": 80,
            "reps": 1,
            "kg": 72
          }
        ],
        "imr": 52.8,
        "tonnage": 712.8,
        "reps": 15,
        "avgKg": 47.5
      },
      {
        "code": "a6",
        "day": "Viernes",
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          },
          {
            "percent": 67,
            "reps": 3,
            "kg": 60.3
          },
          {
            "percent": 67,
            "reps": 3,
            "kg": 60.3
          },
          {
            "percent": 67,
            "reps": 3,
            "kg": 60.3
          }
        ],
        "imr": 55.0,
        "tonnage": 1039.5,
        "reps": 21,
        "avgKg": 49.5
      },
      {
        "code": "a7",
        "day": "Lunes",
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          },
          {
            "percent": 78,
            "reps": 1,
            "kg": 70.2
          },
          {
            "percent": 85,
            "reps": 1,
            "kg": 76.5
          },
          {
            "percent": 85,
            "reps": 1,
            "kg": 76.5
          }
        ],
        "imr": 53.3,
        "tonnage": 720.0,
        "reps": 15,
        "avgKg": 48.0
      },
      {
        "code": "a8",
        "day": "Viernes",
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          },
          {
            "percent": 72,
            "reps": 2,
            "kg": 64.8
          },
          {
            "percent": 72,
            "reps": 2,
            "kg": 64.8
          },
          {
            "percent": 72,
            "reps": 2,
            "kg": 64.8
          }
        ],
        "imr": 54.7,
        "tonnage": 885.6,
        "reps": 18,
        "avgKg": 49.2
      },
      {
        "code": "a9",
        "day": "Lunes",
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          },
          {
            "percent": 78,
            "reps": 1,
            "kg": 70.2
          },
          {
            "percent": 85,
            "reps": 1,
            "kg": 76.5
          },
          {
            "percent": 85,
            "reps": 1,
            "kg": 76.5
          },
          {
            "percent": 85,
            "reps": 1,
            "kg": 76.5
          }
        ],
        "imr": 55.3,
        "tonnage": 796.5,
        "reps": 16,
        "avgKg": 49.8
      },
      {
        "code": "a10",
        "day": "Viernes",
        "sets": [
          {
            "percent": 33,
            "reps": 3,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 3,
            "kg": 39.6
          },
          {
            "percent": 56,
            "reps": 3,
            "kg": 50.4
          },
          {
            "percent": 80,
            "reps": 1,
            "kg": 72
          },
          {
            "percent": 80,
            "reps": 1,
            "kg": 72
          },
          {
            "percent": 80,
            "reps": 1,
            "kg": 72
          }
        ],
        "imr": 53.3,
        "tonnage": 575.1,
        "reps": 12,
        "avgKg": 47.9
      },
      {
        "code": "a11",
        "day": "Martes",
        "sets": [
          {
            "percent": 33,
            "reps": 3,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 3,
            "kg": 39.6
          },
          {
            "percent": 56,
            "reps": 3,
            "kg": 50.4
          }
        ],
        "imr": 44.3,
        "tonnage": 359.1,
        "reps": 9,
        "avgKg": 39.9
      }
    ]
  },
  {
    "name": "ARRANQUE",
    "referenceKg": 90,
    "sessions": [
      {
        "code": "a12",
        "day": "Jueves",
        "sets": [
          {
            "percent": 33,
            "reps": 3,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 3,
            "kg": 39.6
          },
          {
            "percent": 56,
            "reps": 3,
            "kg": 50.4
          }
        ],
        "imr": 44.3,
        "tonnage": 359.1,
        "reps": 9,
        "avgKg": 39.9
      },
      {
        "code": "a13",
        "day": null,
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          }
        ],
        "imr": 46.0,
        "tonnage": 496.8,
        "reps": 12,
        "avgKg": 41.4
      },
      {
        "code": "a14",
        "day": null,
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          }
        ],
        "imr": 46.0,
        "tonnage": 496.8,
        "reps": 12,
        "avgKg": 41.4
      },
      {
        "code": "a15",
        "day": null,
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          }
        ],
        "imr": 46.0,
        "tonnage": 496.8,
        "reps": 12,
        "avgKg": 41.4
      },
      {
        "code": "a16",
        "day": null,
        "sets": [
          {
            "percent": 33,
            "reps": 4,
            "kg": 29.7
          },
          {
            "percent": 44,
            "reps": 4,
            "kg": 39.6
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 54.9
          }
        ],
        "imr": 46.0,
        "tonnage": 496.8,
        "reps": 12,
        "avgKg": 41.4
      }
    ]
  },
  {
    "name": "PECHO",
    "referenceKg": 140,
    "sessions": [
      {
        "code": "p1",
        "day": "Viernes",
        "sets": [
          {
            "percent": 36,
            "reps": 6,
            "kg": 50.4
          },
          {
            "percent": 57,
            "reps": 3,
            "kg": 79.8
          },
          {
            "percent": 71.5,
            "reps": 2,
            "kg": 100.1
          },
          {
            "percent": 82,
            "reps": 1,
            "kg": 114.8
          },
          {
            "percent": 82,
            "reps": 1,
            "kg": 114.8
          }
        ],
        "imr": 53.4,
        "tonnage": 971.6,
        "reps": 13,
        "avgKg": 74.7
      },
      {
        "code": "p2",
        "day": "Lunes",
        "sets": [
          {
            "percent": 36,
            "reps": 8,
            "kg": 50.4
          },
          {
            "percent": 46.5,
            "reps": 7,
            "kg": 65.1
          },
          {
            "percent": 46.5,
            "reps": 7,
            "kg": 65.1
          },
          {
            "percent": 46.5,
            "reps": 7,
            "kg": 65.1
          },
          {
            "percent": 46.5,
            "reps": 7,
            "kg": 65.1
          }
        ],
        "imr": 44.2,
        "tonnage": 2226.0,
        "reps": 36,
        "avgKg": 61.8
      },
      {
        "code": "p3",
        "day": "Viernes",
        "sets": [
          {
            "percent": 36,
            "reps": 6,
            "kg": 50.4
          },
          {
            "percent": 57,
            "reps": 3,
            "kg": 79.8
          },
          {
            "percent": 78.5,
            "reps": 2,
            "kg": 109.9
          },
          {
            "percent": 79.5,
            "reps": 2,
            "kg": 111.3
          },
          {
            "percent": 78.5,
            "reps": 2,
            "kg": 109.9
          }
        ],
        "imr": 57.3,
        "tonnage": 1204.0,
        "reps": 15,
        "avgKg": 80.3
      },
      {
        "code": "p4",
        "day": "Lunes",
        "sets": [
          {
            "percent": 36,
            "reps": 8,
            "kg": 50.4
          },
          {
            "percent": 53.5,
            "reps": 5,
            "kg": 74.9
          },
          {
            "percent": 53.5,
            "reps": 5,
            "kg": 74.9
          },
          {
            "percent": 53.5,
            "reps": 5,
            "kg": 74.9
          }
        ],
        "imr": 47.4,
        "tonnage": 1526.7,
        "reps": 23,
        "avgKg": 66.4
      },
      {
        "code": "p5",
        "day": "Viernes",
        "sets": [
          {
            "percent": 36,
            "reps": 6,
            "kg": 50.4
          },
          {
            "percent": 57,
            "reps": 3,
            "kg": 79.8
          },
          {
            "percent": 71.5,
            "reps": 2,
            "kg": 100.1
          },
          {
            "percent": 71.5,
            "reps": 2,
            "kg": 100.1
          },
          {
            "percent": 71.5,
            "reps": 2,
            "kg": 100.1
          }
        ],
        "imr": 54.4,
        "tonnage": 1142.4,
        "reps": 15,
        "avgKg": 76.2
      },
      {
        "code": "p6",
        "day": "Lunes",
        "sets": [
          {
            "percent": 36,
            "reps": 8,
            "kg": 50.4
          },
          {
            "percent": 53.5,
            "reps": 5,
            "kg": 74.9
          },
          {
            "percent": 53.5,
            "reps": 5,
            "kg": 74.9
          },
          {
            "percent": 53.5,
            "reps": 5,
            "kg": 74.9
          },
          {
            "percent": 53.5,
            "reps": 5,
            "kg": 74.9
          }
        ],
        "imr": 48.5,
        "tonnage": 1901.2,
        "reps": 28,
        "avgKg": 67.9
      },
      {
        "code": "p7",
        "day": "Viernes",
        "sets": [
          {
            "percent": 36,
            "reps": 8,
            "kg": 50.4
          },
          {
            "percent": 53.5,
            "reps": 3,
            "kg": 74.9
          },
          {
            "percent": 64,
            "reps": 3,
            "kg": 89.6
          },
          {
            "percent": 64,
            "reps": 3,
            "kg": 89.6
          },
          {
            "percent": 64,
            "reps": 3,
            "kg": 89.6
          }
        ],
        "imr": 51.2,
        "tonnage": 1434.3,
        "reps": 20,
        "avgKg": 71.7
      },
      {
        "code": "p8",
        "day": "Lunes",
        "sets": [
          {
            "percent": 36,
            "reps": 8,
            "kg": 50.4
          },
          {
            "percent": 57,
            "reps": 5,
            "kg": 79.8
          },
          {
            "percent": 57,
            "reps": 5,
            "kg": 79.8
          },
          {
            "percent": 57,
            "reps": 4,
            "kg": 79.8
          },
          {
            "percent": 57,
            "reps": 4,
            "kg": 79.8
          }
        ],
        "imr": 50.5,
        "tonnage": 1839.6,
        "reps": 26,
        "avgKg": 70.8
      },
      {
        "code": "p9",
        "day": "Viernes",
        "sets": [
          {
            "percent": 36,
            "reps": 6,
            "kg": 50.4
          },
          {
            "percent": 57,
            "reps": 3,
            "kg": 79.8
          },
          {
            "percent": 64,
            "reps": 4,
            "kg": 89.6
          },
          {
            "percent": 64,
            "reps": 3,
            "kg": 89.6
          },
          {
            "percent": 64,
            "reps": 2,
            "kg": 89.6
          }
        ],
        "imr": 53.5,
        "tonnage": 1348.2,
        "reps": 18,
        "avgKg": 74.9
      },
      {
        "code": "p10",
        "day": "Lunes",
        "sets": [
          {
            "percent": 36,
            "reps": 8,
            "kg": 50.4
          },
          {
            "percent": 50,
            "reps": 5,
            "kg": 70
          },
          {
            "percent": 50,
            "reps": 5,
            "kg": 70
          },
          {
            "percent": 50,
            "reps": 5,
            "kg": 70
          },
          {
            "percent": 50,
            "reps": 5,
            "kg": 70
          }
        ],
        "imr": 46.0,
        "tonnage": 1803.2,
        "reps": 28,
        "avgKg": 64.4
      },
      {
        "code": "p11",
        "day": "Viernes",
        "sets": [
          {
            "percent": 36,
            "reps": 6,
            "kg": 50.4
          },
          {
            "percent": 57,
            "reps": 3,
            "kg": 79.8
          },
          {
            "percent": 71.5,
            "reps": 2,
            "kg": 100.1
          },
          {
            "percent": 82,
            "reps": 2,
            "kg": 114.8
          },
          {
            "percent": 82,
            "reps": 2,
            "kg": 114.8
          }
        ],
        "imr": 57.2,
        "tonnage": 1201.2,
        "reps": 15,
        "avgKg": 80.1
      },
      {
        "code": "p12",
        "day": "Lunes",
        "sets": [
          {
            "percent": 36,
            "reps": 8,
            "kg": 50.4
          },
          {
            "percent": 50,
            "reps": 6,
            "kg": 70
          },
          {
            "percent": 50,
            "reps": 5,
            "kg": 70
          },
          {
            "percent": 50,
            "reps": 4,
            "kg": 70
          }
        ],
        "imr": 45.1,
        "tonnage": 1453.2,
        "reps": 23,
        "avgKg": 63.2
      },
      {
        "code": "p13",
        "day": "Viernes",
        "sets": [
          {
            "percent": 36,
            "reps": 6,
            "kg": 50.4
          },
          {
            "percent": 57,
            "reps": 5,
            "kg": 79.8
          },
          {
            "percent": 57,
            "reps": 5,
            "kg": 79.8
          },
          {
            "percent": 57,
            "reps": 5,
            "kg": 79.8
          }
        ],
        "imr": 51.0,
        "tonnage": 1499.4,
        "reps": 21,
        "avgKg": 71.4
      },
      {
        "code": "p15",
        "day": "Viernes",
        "sets": [
          {
            "percent": 36,
            "reps": 6,
            "kg": 50.4
          },
          {
            "percent": 57,
            "reps": 3,
            "kg": 79.8
          },
          {
            "percent": 64,
            "reps": 2,
            "kg": 89.6
          },
          {
            "percent": 64,
            "reps": 2,
            "kg": 89.6
          },
          {
            "percent": 64,
            "reps": 2,
            "kg": 89.6
          }
        ],
        "imr": 51.4,
        "tonnage": 1079.4,
        "reps": 15,
        "avgKg": 72.0
      }
    ]
  },
  {
    "name": "REMO EN BANCO",
    "referenceKg": 115,
    "sessions": [
      {
        "code": "e1",
        "day": "Viernes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 70.1
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 70.1
          },
          {
            "percent": 61,
            "reps": 3,
            "kg": 70.1
          },
          {
            "percent": 61,
            "reps": 3,
            "kg": 70.1
          }
        ],
        "imr": 55.8,
        "tonnage": 1282.2,
        "reps": 20,
        "avgKg": 64.1
      },
      {
        "code": "e2",
        "day": "Martes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 70.1
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 70.1
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 70.1
          }
        ],
        "imr": 55.2,
        "tonnage": 1141.9,
        "reps": 18,
        "avgKg": 63.4
      },
      {
        "code": "e3",
        "day": "Viernes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 52,
            "reps": 5,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 5,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 5,
            "kg": 59.8
          }
        ],
        "imr": 49.6,
        "tonnage": 1197.2,
        "reps": 21,
        "avgKg": 57.0
      },
      {
        "code": "e4",
        "day": null,
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 65,
            "reps": 4,
            "kg": 74.8
          },
          {
            "percent": 87,
            "reps": 1,
            "kg": 100.0
          },
          {
            "percent": 69.5,
            "reps": 2,
            "kg": 79.9
          },
          {
            "percent": 61,
            "reps": 3,
            "kg": 70.1
          }
        ],
        "imr": 58.1,
        "tonnage": 1069.5,
        "reps": 16,
        "avgKg": 66.8
      },
      {
        "code": "e5",
        "day": "Viernes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 52,
            "reps": 5,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 5,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 5,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 5,
            "kg": 59.8
          }
        ],
        "imr": 50.0,
        "tonnage": 1496.2,
        "reps": 26,
        "avgKg": 57.5
      },
      {
        "code": "e6",
        "day": "Martes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 61,
            "reps": 3,
            "kg": 70.1
          },
          {
            "percent": 65,
            "reps": 3,
            "kg": 74.8
          },
          {
            "percent": 65,
            "reps": 3,
            "kg": 74.8
          },
          {
            "percent": 65,
            "reps": 3,
            "kg": 74.8
          }
        ],
        "imr": 57.2,
        "tonnage": 1183.3,
        "reps": 18,
        "avgKg": 65.7
      },
      {
        "code": "e7",
        "day": "Viernes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 65,
            "reps": 3,
            "kg": 74.8
          },
          {
            "percent": 65,
            "reps": 3,
            "kg": 74.8
          },
          {
            "percent": 65,
            "reps": 3,
            "kg": 74.8
          },
          {
            "percent": 65,
            "reps": 3,
            "kg": 74.8
          }
        ],
        "imr": 57.8,
        "tonnage": 1197.2,
        "reps": 18,
        "avgKg": 66.5
      },
      {
        "code": "e8",
        "day": "Martes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 61,
            "reps": 3,
            "kg": 70.1
          },
          {
            "percent": 69.5,
            "reps": 2,
            "kg": 79.9
          },
          {
            "percent": 69.5,
            "reps": 2,
            "kg": 79.9
          },
          {
            "percent": 69.5,
            "reps": 2,
            "kg": 79.9
          }
        ],
        "imr": 57.4,
        "tonnage": 990.1,
        "reps": 15,
        "avgKg": 66.0
      },
      {
        "code": "e9",
        "day": "Viernes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 52,
            "reps": 6,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 5,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 4,
            "kg": 59.8
          }
        ],
        "imr": 49.6,
        "tonnage": 1197.2,
        "reps": 21,
        "avgKg": 57.0
      },
      {
        "code": "e10",
        "day": "Martes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 65,
            "reps": 4,
            "kg": 74.8
          },
          {
            "percent": 87,
            "reps": 1,
            "kg": 100.0
          },
          {
            "percent": 87,
            "reps": 1,
            "kg": 100.0
          }
        ],
        "imr": 57.9,
        "tonnage": 799.2,
        "reps": 12,
        "avgKg": 66.6
      },
      {
        "code": "e11",
        "day": "Viernes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 52,
            "reps": 6,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 5,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 5,
            "kg": 59.8
          }
        ],
        "imr": 49.7,
        "tonnage": 1257.0,
        "reps": 22,
        "avgKg": 57.1
      },
      {
        "code": "e12",
        "day": "Martes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 61,
            "reps": 3,
            "kg": 70.1
          },
          {
            "percent": 69.5,
            "reps": 3,
            "kg": 79.9
          },
          {
            "percent": 69.5,
            "reps": 3,
            "kg": 79.9
          },
          {
            "percent": 69.5,
            "reps": 3,
            "kg": 79.9
          }
        ],
        "imr": 59.4,
        "tonnage": 1229.9,
        "reps": 18,
        "avgKg": 68.3
      },
      {
        "code": "e13",
        "day": "Viernes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 52,
            "reps": 6,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 6,
            "kg": 59.8
          },
          {
            "percent": 52,
            "reps": 6,
            "kg": 59.8
          }
        ],
        "imr": 49.9,
        "tonnage": 1376.5,
        "reps": 24,
        "avgKg": 57.4
      },
      {
        "code": "e14",
        "day": "Martes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 70.1
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 70.1
          },
          {
            "percent": 61,
            "reps": 3,
            "kg": 70.1
          }
        ],
        "imr": 54.8,
        "tonnage": 1071.8,
        "reps": 17,
        "avgKg": 63.0
      },
      {
        "code": "e16",
        "day": "Martes",
        "sets": [
          {
            "percent": 43.5,
            "reps": 6,
            "kg": 50.0
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 70.1
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 70.1
          },
          {
            "percent": 61,
            "reps": 4,
            "kg": 70.1
          }
        ],
        "imr": 55.2,
        "tonnage": 1141.9,
        "reps": 18,
        "avgKg": 63.4
      }
    ]
  }
];
