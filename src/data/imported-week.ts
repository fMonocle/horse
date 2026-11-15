import type { HistoryEvent, RoutineAssignment } from "../types";

export const sampleImportedRoutines: RoutineAssignment[] = [
  {
    "id": "imp-lun",
    "athleteId": "a1",
    "coachId": "u-coach-1",
    "date": "2026-10-05",
    "title": "Lunes · fuerza",
    "note": "Importada de la planilla de PEDRO H. MAR DEL PLATA RUGBY CLUB. Período CAMPEONATO, con fecha 2026-10-05. Pausas que figuran en la planilla: PAUSA DE HASTA 1' · PAUSA DE 1'30\" A 2' · EXPLOSIVA PAUSA 2' · PAUSA DE 2' A 3' · SIN PAUSA.",
    "status": "assigned",
    "weekday": "Lunes",
    "institution": "MAR DEL PLATA RUGBY CLUB",
    "period": "CAMPEONATO",
    "sourceName": "PEDRO H",
    "planKey": "pedro-2026-10-05",
    "exercises": [
      {
        "id": "imp-lun-e1",
        "name": "Entrada en calor",
        "prescription": "10'",
        "block": "1",
        "sets": [
          {
            "load": "10'",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-lun-e2",
        "name": "PRESS HOMB 1BB EXP ESTOC",
        "prescription": "32 kg × 2+2 · BARRA CON 12KG · FILMA",
        "block": "1",
        "sets": [
          {
            "load": "32",
            "reps": "2+2"
          }
        ],
        "note": "BARRA CON 12KG · FILMA",
        "videoUrl": "https://www.youtube.com/watch?v=L7nZXhR765U"
      },
      {
        "id": "imp-lun-e3",
        "name": "LANZ MB HORZONT 1PP",
        "prescription": "3 kg × 6+6",
        "block": "2",
        "sets": [
          {
            "load": "3",
            "reps": "6+6"
          }
        ],
        "videoUrl": "https://www.youtube.com/watch?v=VqITQL11nQ4"
      },
      {
        "id": "imp-lun-e4",
        "name": "MOV TOBILLO BANDA",
        "prescription": "10 kg · X3 S/P",
        "block": "2",
        "sets": [
          {
            "load": "10",
            "reps": ""
          }
        ],
        "note": "X3 S/P",
        "videoUrl": "https://www.youtube.com/shorts/ZNp_9ipG86Q"
      },
      {
        "id": "imp-lun-e5",
        "name": "MOV CADERA 90 90",
        "prescription": "10 kg",
        "block": "2",
        "sets": [
          {
            "load": "10",
            "reps": ""
          }
        ],
        "videoUrl": "https://www.youtube.com/watch?v=nsrkBapYucQ"
      },
      {
        "id": "imp-lun-e6",
        "name": "PECHO",
        "prescription": "50,4 kg × 6 · 79,8 kg × 3 · 89,6 kg × 4 · 89,6 kg × 3 · 89,6 kg × 2",
        "code": "P9",
        "block": "3",
        "sets": [
          {
            "load": "50,4",
            "reps": "6"
          },
          {
            "load": "79,8",
            "reps": "3"
          },
          {
            "load": "89,6",
            "reps": "4"
          },
          {
            "load": "89,6",
            "reps": "3"
          },
          {
            "load": "89,6",
            "reps": "2"
          }
        ]
      },
      {
        "id": "imp-lun-e7",
        "name": "LANZ MB HORIZONTAL",
        "prescription": "3 kg × 6",
        "block": "3",
        "sets": [
          {
            "load": "3",
            "reps": "6"
          }
        ]
      },
      {
        "id": "imp-lun-e8",
        "name": "SALTO A 5 CAJONES",
        "prescription": "6 kg",
        "block": "3",
        "sets": [
          {
            "load": "6",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-lun-e9",
        "name": "ARCO Y FLECHA",
        "prescription": "15 kg",
        "block": "3",
        "sets": [
          {
            "load": "15",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-lun-e10",
        "name": "MOV CADERA 90 90",
        "prescription": "10 kg · MIRA VIDEO HIPERVINCULO",
        "block": "3",
        "sets": [
          {
            "load": "10",
            "reps": ""
          }
        ],
        "note": "MIRA VIDEO HIPERVINCULO"
      },
      {
        "id": "imp-lun-e11",
        "name": "REMO EN BANCO",
        "prescription": "50 kg × 6 · 59,8 kg × 5 · 59,8 kg × 5 · 59,8 kg × 5 · 59,8 kg × 5",
        "code": "E5",
        "block": "4",
        "sets": [
          {
            "load": "50",
            "reps": "6"
          },
          {
            "load": "59,8",
            "reps": "5"
          },
          {
            "load": "59,8",
            "reps": "5"
          },
          {
            "load": "59,8",
            "reps": "5"
          },
          {
            "load": "59,8",
            "reps": "5"
          }
        ]
      },
      {
        "id": "imp-lun-e12",
        "name": "BUENOS DIAS A CAJON",
        "prescription": "30 kg × 2 · 35 kg × 1 · 35 kg × 1 · SUBI AL CAJON Y LEVANTA LA PP A 90°",
        "block": "4",
        "sets": [
          {
            "load": "30",
            "reps": "2"
          },
          {
            "load": "35",
            "reps": "1"
          },
          {
            "load": "35",
            "reps": "1"
          }
        ],
        "note": "SUBI AL CAJON Y LEVANTA LA PP A 90°"
      },
      {
        "id": "imp-lun-e13",
        "name": "LANZ MB HORIZONTAL",
        "prescription": "6 kg × 6",
        "block": "4",
        "sets": [
          {
            "load": "6",
            "reps": "6"
          }
        ]
      },
      {
        "id": "imp-lun-e14",
        "name": "PTE COSTADO GLUTEO M",
        "prescription": "10 kg",
        "block": "4",
        "sets": [
          {
            "load": "10",
            "reps": ""
          }
        ],
        "videoUrl": "https://www.youtube.com/watch?v=hdDy1G0vcE8"
      },
      {
        "id": "imp-lun-e15",
        "name": "ROTACION PELOTA PAERD",
        "prescription": "6+6",
        "block": "4",
        "sets": [
          {
            "load": "6+6",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-lun-e16",
        "name": "DOMINADA CERRADA",
        "prescription": "35 kg × 1",
        "block": "5",
        "sets": [
          {
            "load": "35",
            "reps": "1"
          }
        ]
      },
      {
        "id": "imp-lun-e17",
        "name": "LANZ MB VERTICAL",
        "prescription": "6 kg × 6 · X4",
        "block": "5",
        "sets": [
          {
            "load": "6",
            "reps": "6"
          }
        ],
        "note": "X4"
      },
      {
        "id": "imp-lun-e18",
        "name": "ABDOMINAL ISOM MAQ",
        "prescription": "10 kg × 8 · COMO EN LA FOTO HACIENDO PECHO RAPIDO DISCO 10KG",
        "block": "5",
        "sets": [
          {
            "load": "10",
            "reps": "8"
          }
        ],
        "note": "COMO EN LA FOTO HACIENDO PECHO RAPIDO DISCO 10KG"
      },
      {
        "id": "imp-lun-e19",
        "name": "TFL DINAMICO",
        "prescription": "2\" × 7 · MANTENGO 2\" Y REPITO",
        "block": "5",
        "sets": [
          {
            "load": "2\"",
            "reps": "7"
          }
        ],
        "note": "MANTENGO 2\" Y REPITO",
        "videoUrl": "https://youtu.be/TRFqr5J62q0"
      }
    ]
  },
  {
    "id": "imp-mie",
    "athleteId": "a1",
    "coachId": "u-coach-1",
    "date": "2026-10-07",
    "title": "Miércoles · fuerza",
    "note": "Importada de la planilla de PEDRO H. MAR DEL PLATA RUGBY CLUB. Período CAMPEONATO, con fecha 2026-10-05. Pausas que figuran en la planilla: PAUSA DE HASTA 1' · PAUSA DE 1'30\" A 2' · EXPLOSIVA PAUSA 2' · PAUSA DE 2' A 3' · SIN PAUSA.",
    "status": "assigned",
    "weekday": "Miércoles",
    "institution": "MAR DEL PLATA RUGBY CLUB",
    "period": "CAMPEONATO",
    "sourceName": "PEDRO H",
    "planKey": "pedro-2026-10-05",
    "exercises": [
      {
        "id": "imp-mie-e1",
        "name": "Entrada en calor",
        "prescription": "10'",
        "block": "1",
        "sets": [
          {
            "load": "10'",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-mie-e2",
        "name": "SUBIDA A 2-4 CAJ EXP",
        "prescription": "45,2 kg × 2 · 59,9 kg × 2 · 59,9 kg × 2 · 59,9 kg × 2",
        "code": "S14",
        "block": "2",
        "sets": [
          {
            "load": "45,2",
            "reps": "2"
          },
          {
            "load": "59,9",
            "reps": "2"
          },
          {
            "load": "59,9",
            "reps": "2"
          },
          {
            "load": "59,9",
            "reps": "2"
          }
        ]
      },
      {
        "id": "imp-mie-e3",
        "name": "SALTO ESTOCADA ASISTIDO",
        "prescription": "5+5 · EXPLOSIVO SUBIR PP CONTRARIA A 90°",
        "block": "2",
        "sets": [
          {
            "load": "5+5",
            "reps": ""
          }
        ],
        "note": "EXPLOSIVO SUBIR PP CONTRARIA A 90°",
        "videoUrl": "https://www.youtube.com/watch?v=2LQabjrRJdY"
      },
      {
        "id": "imp-mie-e4",
        "name": "MOV HOMB NADO",
        "prescription": "8 kg",
        "block": "2",
        "sets": [
          {
            "load": "8",
            "reps": ""
          }
        ],
        "videoUrl": "https://www.youtube.com/watch?v=Tzr6UunDd50"
      },
      {
        "id": "imp-mie-e5",
        "name": "REMO EN BANCO",
        "prescription": "50 kg × 6 · 70,1 kg × 3 · 74,8 kg × 3 · 74,8 kg × 3 · 74,8 kg × 3",
        "code": "E6",
        "block": "3",
        "sets": [
          {
            "load": "50",
            "reps": "6"
          },
          {
            "load": "70,1",
            "reps": "3"
          },
          {
            "load": "74,8",
            "reps": "3"
          },
          {
            "load": "74,8",
            "reps": "3"
          },
          {
            "load": "74,8",
            "reps": "3"
          }
        ]
      },
      {
        "id": "imp-mie-e6",
        "name": "LANZ MB VERTICAL",
        "prescription": "6 kg × 6",
        "block": "3",
        "sets": [
          {
            "load": "6",
            "reps": "6"
          }
        ]
      },
      {
        "id": "imp-mie-e7",
        "name": "ELEVAC CADERA PIE 4 CAJ",
        "prescription": "25 kg × 4 · COMO EN FOTO MANC CINTURA",
        "block": "3",
        "sets": [
          {
            "load": "25",
            "reps": "4"
          }
        ],
        "note": "COMO EN FOTO MANC CINTURA"
      },
      {
        "id": "imp-mie-e8",
        "name": "PTE COSTADO GLUTEO M",
        "prescription": "12 kg",
        "block": "3",
        "sets": [
          {
            "load": "12",
            "reps": ""
          }
        ],
        "videoUrl": "https://www.youtube.com/watch?v=hdDy1G0vcE8"
      },
      {
        "id": "imp-mie-e9",
        "name": "ROTACION PELOTA PAERD",
        "prescription": "6+6",
        "block": "3",
        "sets": [
          {
            "load": "6+6",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-mie-e10",
        "name": "DOMINADA ABIERTA",
        "prescription": "20 kg × 2",
        "block": "4",
        "sets": [
          {
            "load": "20",
            "reps": "2"
          }
        ]
      },
      {
        "id": "imp-mie-e11",
        "name": "TRX ESPALDA EXPLOSIVO",
        "prescription": "8 kg · X3",
        "block": "4",
        "sets": [
          {
            "load": "8",
            "reps": ""
          }
        ],
        "note": "X3"
      },
      {
        "id": "imp-mie-e12",
        "name": "SALTO FRONTAL",
        "prescription": "5 kg",
        "block": "4",
        "sets": [
          {
            "load": "5",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-mie-e13",
        "name": "TFL DINAMICO",
        "prescription": "2\" × 7 · MANTENGO 2\" Y REPITO",
        "block": "4",
        "sets": [
          {
            "load": "2\"",
            "reps": "7"
          }
        ],
        "note": "MANTENGO 2\" Y REPITO",
        "videoUrl": "https://youtu.be/TRFqr5J62q0"
      },
      {
        "id": "imp-mie-e14",
        "name": "CURL OLIMPICA",
        "prescription": "40 kg × 8",
        "block": "5",
        "sets": [
          {
            "load": "40",
            "reps": "8"
          }
        ]
      },
      {
        "id": "imp-mie-e15",
        "name": "MARTILLO",
        "prescription": "12 kg × 20",
        "block": "5",
        "sets": [
          {
            "load": "12",
            "reps": "20"
          }
        ]
      },
      {
        "id": "imp-mie-e16",
        "name": "GATO",
        "prescription": "10 kg",
        "block": "5",
        "sets": [
          {
            "load": "10",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-mie-e17",
        "name": "PAT CADERA PP EXT EXPLOS",
        "prescription": "6+6",
        "block": "5",
        "sets": [
          {
            "load": "6+6",
            "reps": ""
          }
        ],
        "videoUrl": "https://www.youtube.com/watch?v=m50Jlp7v6W0"
      },
      {
        "id": "imp-mie-e18",
        "name": "PSOAS DINAMICO BANDA",
        "prescription": "10 kg",
        "block": "5",
        "sets": [
          {
            "load": "10",
            "reps": ""
          }
        ]
      }
    ]
  },
  {
    "id": "imp-jue",
    "athleteId": "a1",
    "coachId": "u-coach-1",
    "date": "2026-10-08",
    "title": "Jueves · fuerza",
    "note": "Importada de la planilla de PEDRO H. MAR DEL PLATA RUGBY CLUB. Período CAMPEONATO, con fecha 2026-10-05. Pausas que figuran en la planilla: PAUSA DE HASTA 1' · PAUSA DE 1'30\" A 2' · EXPLOSIVA PAUSA 2' · PAUSA DE 2' A 3' · SIN PAUSA.",
    "status": "assigned",
    "weekday": "Jueves",
    "institution": "MAR DEL PLATA RUGBY CLUB",
    "period": "CAMPEONATO",
    "sourceName": "PEDRO H",
    "planKey": "pedro-2026-10-05",
    "exercises": [
      {
        "id": "imp-jue-e1",
        "name": "Entrada en calor",
        "prescription": "10'",
        "block": "1",
        "sets": [
          {
            "load": "10'",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-jue-e2",
        "name": "LANZ MB ARRIBA C/ENVION",
        "prescription": "9 kg × 6",
        "block": "2",
        "sets": [
          {
            "load": "9",
            "reps": "6"
          }
        ]
      },
      {
        "id": "imp-jue-e3",
        "name": "LANZ MB HORZONT 1PP",
        "prescription": "6 kg × 4+4",
        "block": "2",
        "sets": [
          {
            "load": "6",
            "reps": "4+4"
          }
        ],
        "videoUrl": "https://www.youtube.com/watch?v=VqITQL11nQ4"
      },
      {
        "id": "imp-jue-e4",
        "name": "MOV TOBILLO BANDA",
        "prescription": "10 kg · X4 S/P",
        "block": "2",
        "sets": [
          {
            "load": "10",
            "reps": ""
          }
        ],
        "note": "X4 S/P",
        "videoUrl": "https://www.youtube.com/shorts/ZNp_9ipG86Q"
      },
      {
        "id": "imp-jue-e5",
        "name": "MOV CADERA 90 90",
        "prescription": "10 kg",
        "block": "2",
        "sets": [
          {
            "load": "10",
            "reps": ""
          }
        ],
        "videoUrl": "https://www.youtube.com/watch?v=nsrkBapYucQ"
      },
      {
        "id": "imp-jue-e6",
        "name": "PECHO",
        "prescription": "50,4 kg × 8 · 79,8 kg × 5 · 79,8 kg × 5 · 79,8 kg × 4 · 79,8 kg × 4",
        "code": "P8",
        "block": "3",
        "sets": [
          {
            "load": "50,4",
            "reps": "8"
          },
          {
            "load": "79,8",
            "reps": "5"
          },
          {
            "load": "79,8",
            "reps": "5"
          },
          {
            "load": "79,8",
            "reps": "4"
          },
          {
            "load": "79,8",
            "reps": "4"
          }
        ]
      },
      {
        "id": "imp-jue-e7",
        "name": "LEÑADOR C/DISCO",
        "prescription": "10 kg × 6+6",
        "block": "3",
        "sets": [
          {
            "load": "10",
            "reps": "6+6"
          }
        ],
        "videoUrl": "https://www.youtube.com/shorts/qHzj8-LIPIs"
      },
      {
        "id": "imp-jue-e8",
        "name": "PSOAS RECTO DINAMICO",
        "prescription": "12 kg",
        "block": "3",
        "sets": [
          {
            "load": "12",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-jue-e9",
        "name": "FZA BB DISCO ESPALDA",
        "prescription": "25 kg × 4",
        "block": "4",
        "sets": [
          {
            "load": "25",
            "reps": "4"
          }
        ]
      },
      {
        "id": "imp-jue-e10",
        "name": "FZA BB C/APLAUSO",
        "prescription": "4 kg",
        "block": "4",
        "sets": [
          {
            "load": "4",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-jue-e11",
        "name": "LANZ MB HORIZONTAL",
        "prescription": "6 kg × 6",
        "block": "4",
        "sets": [
          {
            "load": "6",
            "reps": "6"
          }
        ]
      },
      {
        "id": "imp-jue-e12",
        "name": "FACE PULL BANDA",
        "prescription": "15 kg",
        "block": "4",
        "sets": [
          {
            "load": "15",
            "reps": ""
          }
        ],
        "videoUrl": "https://www.youtube.com/watch?si=bXVmhWZTD5GLfCP7&v=w06tVYSLH20&feature=youtu.be"
      },
      {
        "id": "imp-jue-e13",
        "name": "PUENTE COSTADO TRACC",
        "prescription": "15 kg",
        "block": "4",
        "sets": [
          {
            "load": "15",
            "reps": ""
          }
        ],
        "videoUrl": "https://www.youtube.com/watch?v=DQjBN2EvQ58"
      },
      {
        "id": "imp-jue-e14",
        "name": "FRANCES BARRA OLIMP",
        "prescription": "35 kg × 12 · X3 S/P",
        "block": "5",
        "sets": [
          {
            "load": "35",
            "reps": "12"
          }
        ],
        "note": "X3 S/P"
      },
      {
        "id": "imp-jue-e15",
        "name": "FRANCES BANDA ARROD",
        "prescription": "15 kg",
        "block": "5",
        "sets": [
          {
            "load": "15",
            "reps": ""
          }
        ]
      },
      {
        "id": "imp-jue-e16",
        "name": "PASE MB ESTOCAD",
        "prescription": "3 kg × 4+4 · EN POSICION ESTOCADA C/APOYO RODA, PASE TIPO RUGBY",
        "block": "5",
        "sets": [
          {
            "load": "3",
            "reps": "4+4"
          }
        ],
        "note": "EN POSICION ESTOCADA C/APOYO RODA, PASE TIPO RUGBY"
      },
      {
        "id": "imp-jue-e17",
        "name": "ANGELITO PARED",
        "prescription": "10 kg",
        "block": "5",
        "sets": [
          {
            "load": "10",
            "reps": ""
          }
        ]
      }
    ]
  }
];

export const sampleImportHistory: HistoryEvent[] = [
  {
    "id": "h-imp-1",
    "athleteId": "a1",
    "date": "2026-10-05",
    "kind": "routine",
    "title": "Rutina importada: Lunes · fuerza",
    "detail": "19 ejercicios de la planilla de PEDRO H.",
    "actor": "Martín Sosa"
  },
  {
    "id": "h-imp-2",
    "athleteId": "a1",
    "date": "2026-10-07",
    "kind": "routine",
    "title": "Rutina importada: Miércoles · fuerza",
    "detail": "18 ejercicios de la planilla de PEDRO H.",
    "actor": "Martín Sosa"
  },
  {
    "id": "h-imp-3",
    "athleteId": "a1",
    "date": "2026-10-08",
    "kind": "routine",
    "title": "Rutina importada: Jueves · fuerza",
    "detail": "17 ejercicios de la planilla de PEDRO H.",
    "actor": "Martín Sosa"
  }
];
