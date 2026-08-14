// A handful of hooks read their initial state straight out of localStorage
// via JSON.parse with no guard around it — fine as long as the stored value
// is always exactly what this app itself last wrote there, but a corrupted
// write, another tab/extension writing garbage into the same key, or manual
// tampering via devtools all produce a string JSON.parse throws on. With no
// ErrorBoundary anywhere in the app, that throw happens during the initial
// render of a useState lazy initializer and takes the whole React tree down
// to a white screen with no in-app recovery. Centralizing the try/catch
// here (rather than repeating it at each call site) means every localStorage
// read gets the same "corrupted data just means start fresh" fallback
// instead of a hard crash.
export function safeJSONParse(value, fallback) {
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
