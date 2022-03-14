/**
 * This function exists only for syntax highlighting.
 * Returns the input as-is.
 */
export const css = (
  [thead, ...ttail]: readonly string[],
  ...[phead, ...ptail]: readonly string[]
): string =>
  typeof thead === "string" ? thead + (phead ?? "") + css(ttail, ...ptail) : "";
