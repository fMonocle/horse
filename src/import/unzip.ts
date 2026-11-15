// Lee un .xlsx (ZIP) en el navegador, sin dependencias.
const EOCD = 0x06054b50;
const CENTRAL = 0x02014b50;
const LOCAL = 0x04034b50;

export async function unzip(buffer: ArrayBuffer): Promise<Map<string, Uint8Array>> {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  let eocd = -1;
  const start = Math.max(0, bytes.length - 22 - 0xffff);
  for (let index = bytes.length - 22; index >= start; index -= 1) {
    if (view.getUint32(index, true) === EOCD) {
      eocd = index;
      break;
    }
  }
  if (eocd < 0) throw new Error("El archivo no es un Excel válido.");

  const count = view.getUint16(eocd + 10, true);
  let cursor = view.getUint32(eocd + 16, true);
  const files = new Map<string, Uint8Array>();

  for (let index = 0; index < count; index += 1) {
    if (view.getUint32(cursor, true) !== CENTRAL) throw new Error("El archivo no es un Excel válido.");
    const method = view.getUint16(cursor + 10, true);
    const compressed = view.getUint32(cursor + 20, true);
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const localOffset = view.getUint32(cursor + 42, true);
    const name = new TextDecoder().decode(bytes.subarray(cursor + 46, cursor + 46 + nameLength));
    cursor += 46 + nameLength + extraLength + commentLength;

    if (name.endsWith("/")) continue;
    if (view.getUint32(localOffset, true) !== LOCAL) throw new Error("El archivo no es un Excel válido.");
    const localName = view.getUint16(localOffset + 26, true);
    const localExtra = view.getUint16(localOffset + 28, true);
    const dataStart = localOffset + 30 + localName + localExtra;
    const slice = bytes.subarray(dataStart, dataStart + compressed);
    files.set(name, method === 0 ? slice : await inflate(slice));
  }

  return files;
}

async function inflate(data: Uint8Array): Promise<Uint8Array> {
  const copy = new Uint8Array(data.byteLength);
  copy.set(data);
  const stream = new Blob([copy]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
