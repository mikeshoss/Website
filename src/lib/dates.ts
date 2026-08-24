/**
 * Date helpers for content.ts.
 *
 * Content stores machine-readable ISO dates; the human-readable strings the
 * pages render are derived from them here. That keeps one source of truth and
 * lets the JSON API emit real dates instead of display strings.
 *
 * Accepted input granularities: "YYYY", "YYYY-MM", "YYYY-MM-DD".
 */

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** En-dash, matching the separator used across the site. */
const DASH = "–";

/**
 * Parses an ISO date without going through `Date`, which would apply a
 * timezone offset and can shift "2023-11-02" to the previous day.
 */
function parts(iso: string): { year: number; month?: number; day?: number } {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
}

/** "2025-11" → "Nov 2025"; "2023" → "2023"; "2023-11-02" → "Nov 2, 2023". */
export function formatDate(iso: string): string {
  const { year, month, day } = parts(iso);

  if (!month) return String(year);

  const name = MONTHS[month - 1];
  return day ? `${name} ${day}, ${year}` : `${name} ${year}`;
}

/**
 * Renders a date range for display. An absent `end` means the role or project
 * is ongoing.
 *
 * formatPeriod("2025-11")            → "Nov 2025 – Present"
 * formatPeriod("2025-06", "2025-11") → "Jun 2025 – Nov 2025"
 * formatPeriod("2023", "2025")       → "2023 – 2025"
 */
export function formatPeriod(start: string, end?: string): string {
  return `${formatDate(start)} ${DASH} ${end ? formatDate(end) : "Present"}`;
}

/**
 * Sort key that orders newest-first and treats ongoing entries as most recent.
 * Pads to a full ISO date so mixed granularities compare correctly.
 */
export function recencyKey(entry: { start: string; end?: string }): string {
  const pad = (iso: string) => {
    const [year, month = "01", day = "01"] = iso.split("-");
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  return entry.end ? pad(entry.end) : "9999-12-31";
}
