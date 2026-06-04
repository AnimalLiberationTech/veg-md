export function fixDiacritics(value: string) {
  if (!/[ÃÂÄÅ]/.test(value)) {
    return value;
  }

  try {
    const bytes = Uint8Array.from(value, (character) => character.charCodeAt(0) & 0xff);
    return new TextDecoder("utf-8").decode(bytes);
  } catch {
    return value;
  }
}

export function stripHtmlTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function unescapeCommas(value: string) {
  return value.replace(/\\,/g, ",");
}

export function nl2br(value: string) {
  return value
    .replace(/\\n\\n/g, "<br><br>")
    .replace(/\\n/g, "<br>");
}