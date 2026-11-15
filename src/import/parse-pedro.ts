import type { SetLoad } from "../types";
import { unzip } from "./unzip";

export type ParsedExercise = {
  block: string | null;
  name: string;
  code?: string;
  sets: SetLoad[];
  note?: string;
  videoUrl?: string;
  warnings: string[];
};

export type ParsedDay = {
  weekday: string;
  date: string | null;
  exercises: ParsedExercise[];
  warnings: string[];
};

export type ParsedPlan = {
  sheetName: string;
  athleteName: string | null;
  institution: string | null;
  period: string | null;
  startDate: string | null;
  restNotes: string[];
  days: ParsedDay[];
  warnings: string[];
};

const DAY_ORDER = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"] as const;
const WEEKDAY_INDEX: Record<string, number> = {
  LUNES: 0,
  MARTES: 1,
  MIERCOLES: 2,
  JUEVES: 3,
  VIERNES: 4,
  SABADO: 5,
  DOMINGO: 6,
};

type Cell = { value: string; type: string };
type Sheet = { name: string; cells: Map<string, Cell>; links: Map<string, string> };
type Tag = { name: string; attrs: Record<string, string>; text: string; inner: string };

export async function parsePedroWorkbook(buffer: ArrayBuffer): Promise<ParsedPlan> {
  const files = await unzip(buffer);
  const sheets = readSheets(files);
  const planSheet = sheets.find((sheet) => sheetHasDays(sheet)) ?? null;
  if (!planSheet) {
    return {
      sheetName: sheets[0]?.name ?? "",
      athleteName: null,
      institution: null,
      period: null,
      startDate: null,
      restNotes: [],
      days: [],
      warnings: ["No encontré una hoja con los días de entrenamiento (lunes, miércoles, viernes)."],
    };
  }
  return parsePlanSheet(planSheet, sheets);
}

function readSheets(files: Map<string, Uint8Array>): Sheet[] {
  const shared = sharedStrings(files);
  const targets = new Map<string, string>();
  tags(textOf(files, "xl/_rels/workbook.xml.rels"), "Relationship").forEach((rel) => {
    if (rel.attrs.Id && rel.attrs.Target) targets.set(rel.attrs.Id, rel.attrs.Target.replace(/^\//, ""));
  });

  return tags(textOf(files, "xl/workbook.xml"), "sheet").map((sheet) => {
    const name = sheet.attrs.name ?? "Hoja";
    const id = sheet.attrs["r:id"] ?? "";
    const target = targets.get(id) ?? "";
    const path = target.startsWith("xl/") ? target : `xl/${target}`;
    const source = textOf(files, path);
    const cells = new Map<string, Cell>();
    tags(source, "c").forEach((cell) => {
      const ref = cell.attrs.r;
      if (!ref) return;
      const type = cell.attrs.t ?? "n";
      const raw = tags(cell.inner, "v")[0]?.text ?? "";
      const value = type === "s" ? shared[Number(raw)] ?? "" : raw;
      if (value.trim()) cells.set(ref, { value: decodeXml(value).trim(), type });
    });
    const links = new Map<string, string>();
    const relPath = path.replace("worksheets/", "worksheets/_rels/") + ".rels";
    const linkRels = new Map<string, string>();
    tags(textOf(files, relPath), "Relationship").forEach((rel) => {
      if (rel.attrs.Id && rel.attrs.Target) linkRels.set(rel.attrs.Id, decodeURIComponent(rel.attrs.Target));
    });
    tags(source, "hyperlink").forEach((link) => {
      const url = link.attrs["r:id"] ? linkRels.get(link.attrs["r:id"]) : undefined;
      if (link.attrs.ref && url) links.set(link.attrs.ref, url);
    });
    return { name, cells, links };
  });
}

function sharedStrings(files: Map<string, Uint8Array>): string[] {
  return tags(textOf(files, "xl/sharedStrings.xml"), "si").map((item) =>
    decodeXml(tags(item.inner, "t").map((node) => node.text).join("")),
  );
}

function textOf(files: Map<string, Uint8Array>, path: string): string {
  const bytes = files.get(path);
  return bytes ? new TextDecoder().decode(bytes) : "";
}

function tags(source: string, name: string): Tag[] {
  const pattern = new RegExp(`<${name}\\b([^>]*?)(?:/>|>([\\s\\S]*?)</${name}>)`, "g");
  return [...source.matchAll(pattern)].map((match) => ({
    name,
    attrs: attrs(match[1] ?? ""),
    inner: match[2] ?? "",
    text: (match[2] ?? "").replace(/<[^>]+>/g, ""),
  }));
}

function attrs(source: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const match of source.matchAll(/([\w:]+)="([^"]*)"/g)) result[match[1]] = decodeXml(match[2]);
  return result;
}

function decodeXml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function sheetHasDays(sheet: Sheet): boolean {
  return [...sheet.cells.values()].some((cell) => DAY_ORDER.includes(normalizeDay(cell.value) as (typeof DAY_ORDER)[number]));
}

function parsePlanSheet(sheet: Sheet, sheets: Sheet[]): ParsedPlan {
  const warnings: string[] = [];
  const labeled = (label: string) => valueBeside(sheet, label);
  const athleteName = labeled("Nombre:") || null;
  const period = labeled("Periodo:") || labeled("Período:") || null;
  const startDate = excelDate(labeled("Fecha:"));
  const institution = institutionOf(sheet);
  const restNotes = [...new Set([...sheet.cells.values()].map((cell) => cell.value).filter((value) => /pausa|sin pausa/i.test(value)))];

  const rows = [...sheet.cells.keys()].map(rowOf);
  const lastRow = rows.reduce((max, row) => Math.max(max, row), 0);
  const dayStarts: Array<{ row: number; weekday: string }> = [];
  for (let row = 1; row <= lastRow; row += 1) {
    const weekday = normalizeDay(text(sheet, "B", row));
    if (DAY_ORDER.includes(weekday as (typeof DAY_ORDER)[number])) dayStarts.push({ row, weekday });
  }

  const seen = new Set<string>();
  const days: ParsedDay[] = [];
  const cursor: { date: string | null } = { date: null };
  let repeated = 0;
  dayStarts.forEach((start, index) => {
    const end = (dayStarts[index + 1]?.row ?? lastRow + 1) - 1;
    const parsed = parseDay(sheet, start.weekday, start.row, end);
    const signature = `${start.weekday}|${parsed.exercises.map((exercise) => `${exercise.name}:${exercise.sets.map((set) => set.load + "x" + set.reps).join(",")}:${exercise.note ?? ""}`).join(";")}`;
    if (seen.has(signature)) {
      repeated += 1;
      return;
    }
    seen.add(signature);
    parsed.date = nextDate(start.weekday, startDate, cursor);
    if (parsed.exercises.length === 0) {
      warnings.push(`${titleCase(start.weekday)} no tiene ejercicios con datos.`);
      return;
    }
    days.push(parsed);
  });
  if (repeated > 0) {
    warnings.push(`La planilla repite ${repeated} ${repeated === 1 ? "día idéntico" : "días idénticos"}. Se importa una sola copia de cada uno.`);
  }
  if (days.some((day) => day.weekday === "JUEVES") && !days.some((day) => day.weekday === "VIERNES")) {
    warnings.push("El tercer día figura como jueves. En este archivo no hay un viernes.");
  }
  if (!athleteName) warnings.push("No encontré el nombre del deportista.");
  if (!startDate) warnings.push("No encontré la fecha de la planilla, o no se pudo leer.");
  if (sheets.some(isEmptyTrackingSheet)) {
    warnings.push("La hoja de seguimiento está vacía: no hay registro de lo que hizo el deportista.");
  }
  days.forEach((day) => day.warnings.forEach((warning) => warnings.push(`${titleCase(day.weekday)}: ${warning}`)));

  return { sheetName: sheet.name, athleteName, institution, period, startDate, restNotes, days, warnings: [...new Set(warnings)] };
}

function parseDay(sheet: Sheet, weekday: string, from: number, to: number): ParsedDay {
  const exercises: ParsedExercise[] = [];
  const warnings: string[] = [];
  let block: string | null = null;
  for (let row = from + 1; row <= to; row += 1) {
    const name = text(sheet, "B", row);
    if (!name || name.toLowerCase() === "ejercicios") continue;
    const marker = text(sheet, "A", row);
    if (/^\d+$/.test(marker) && marker !== "0") block = marker;
    else if (marker === "0") warnings.push(`“${name}” tiene bloque 0. Quedó en el bloque ${block ?? "sin número"}.`);
    const codeRaw = text(sheet, "C", row);
    const code = /^[A-Za-z]+\d+$/.test(codeRaw) ? codeRaw.toUpperCase() : undefined;
    const sets: SetLoad[] = [];
    const notes: string[] = [];
    if (codeRaw && !code && !/^\d+$/.test(codeRaw)) notes.push(codeRaw);
    for (const column of [4, 7, 10, 13, 16]) {
      const loadRaw = text(sheet, columnName(column), row);
      const repsRaw = text(sheet, columnName(column + 2), row);
      const extra = text(sheet, columnName(column + 1), row);
      for (const piece of [loadRaw, repsRaw, extra]) {
        if (piece && isNote(piece)) notes.push(piece);
      }
      if (isError(loadRaw) || isError(repsRaw)) {
        warnings.push(`“${name}” tiene un error de fórmula (${loadRaw || repsRaw}). Esa serie no se importó.`);
        continue;
      }
      const load = setValue(loadRaw);
      const reps = setValue(repsRaw);
      if (!load && !reps) continue;
      if (load === "0" && (!reps || reps === "0")) continue;
      if (!load && reps === "0") continue;
      sets.push({ load: load ?? "", reps: reps ?? "" });
    }
    if (!block) warnings.push(`“${name}” no tiene número de bloque.`);
    if (sets.length === 0 && notes.length === 0) warnings.push(`“${name}” no tiene series ni indicaciones.`);
    const videoUrl = sheet.links.get(`B${row}`);
    exercises.push({
      block,
      name,
      code,
      sets,
      note: [...new Set(notes)].join(" · ") || undefined,
      videoUrl,
      warnings: [],
    });
  }
  return { weekday, date: null, exercises, warnings: [...new Set(warnings)] };
}

function nextDate(weekday: string, startDate: string | null, cursor: { date: string | null }): string | null {
  const from = cursor.date ? addIsoDays(cursor.date, 1) : startDate;
  const date = dateFor(weekday, from);
  if (date) cursor.date = date;
  return date;
}

function addIsoDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + days);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function dateFor(weekday: string, startDate: string | null): string | null {
  if (!startDate) return null;
  const start = new Date(`${startDate}T00:00:00`);
  const startIndex = (start.getDay() + 6) % 7;
  const target = WEEKDAY_INDEX[weekday];
  if (target === undefined) return null;
  const diff = (target - startIndex + 7) % 7;
  start.setDate(start.getDate() + diff);
  const month = String(start.getMonth() + 1).padStart(2, "0");
  const day = String(start.getDate()).padStart(2, "0");
  return `${start.getFullYear()}-${month}-${day}`;
}

function valueBeside(sheet: Sheet, label: string): string {
  for (const [ref, cell] of sheet.cells) {
    if (cell.value.toLowerCase() !== label.toLowerCase()) continue;
    const row = rowOf(ref);
    const column = columnIndex(ref.replace(/\d+/g, ""));
    for (let next = column + 1; next <= column + 12; next += 1) {
      const value = text(sheet, columnName(next), row);
      if (value) return value;
    }
  }
  return "";
}

function institutionOf(sheet: Sheet): string | null {
  let firstDay = Infinity;
  for (const [ref, cell] of sheet.cells) {
    if (columnName(columnIndex(ref.replace(/\d+/g, ""))) !== "B") continue;
    if (DAY_ORDER.includes(normalizeDay(cell.value) as (typeof DAY_ORDER)[number])) firstDay = Math.min(firstDay, rowOf(ref));
  }
  for (let row = 1; row < firstDay; row += 1) {
    const value = text(sheet, "B", row);
    if (value && value.toLowerCase() !== "ejercicios") return value;
  }
  return null;
}

function isEmptyTrackingSheet(sheet: Sheet): boolean {
  const values = [...sheet.cells.values()].map((cell) => cell.value);
  return values.includes("IMR GRAL.") && values.filter((value) => value !== "0").length < 12;
}

function text(sheet: Sheet, column: string, row: number): string {
  return sheet.cells.get(`${column}${row}`)?.value ?? "";
}

function setValue(raw: string): string | null {
  if (!raw || raw === "/" || isNote(raw) || isError(raw)) return null;
  const numeric = Number(raw.replace(",", "."));
  if (Number.isFinite(numeric)) {
    const rounded = Math.round(numeric * 10) / 10;
    return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(".", ",");
  }
  return raw;
}

function isNote(value: string): boolean {
  return /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(value);
}

function isError(value: string): boolean {
  return value.startsWith("#");
}

function normalizeDay(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();
}

export function titleCase(value: string): string {
  const clean = normalizeDay(value).toLowerCase();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : value;
}

function excelDate(value: string): string | null {
  const serial = Number(value);
  if (!Number.isFinite(serial) || serial < 20000 || serial > 80000) return null;
  const date = new Date(Date.UTC(1899, 11, 30) + serial * 86400000);
  return date.toISOString().slice(0, 10);
}

function rowOf(ref: string): number {
  return Number(ref.replace(/[A-Z]+/g, ""));
}

function columnIndex(column: string): number {
  return [...column].reduce((total, char) => total * 26 + char.charCodeAt(0) - 64, 0);
}

function columnName(index: number): string {
  let name = "";
  let current = index;
  while (current > 0) {
    const mod = (current - 1) % 26;
    name = String.fromCharCode(65 + mod) + name;
    current = Math.floor((current - 1) / 26);
  }
  return name;
}

export function exercisePrescription(exercise: Pick<ParsedExercise, "sets" | "note">): string {
  const sets = exercise.sets
    .map((set) => {
      const load = /^\d+(,\d+)?$/.test(set.load) ? `${set.load} kg` : set.load;
      if (load && set.reps) return `${load} × ${set.reps}`;
      return load || set.reps;
    })
    .filter(Boolean)
    .join(" · ");
  return [sets, exercise.note].filter(Boolean).join(" · ");
}
