// Today's model (SPEC.md §9.2): order[(days since start) mod 365], counting days in Europe/London,
// fixed at build time. The site is rebuilt each morning, so pages stay plain HTML.
import { getEntry } from "astro:content";

/** The date in Europe/London as YYYY-MM-DD. */
export function londonDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function dayIndex(start: string, today: string, length: number) {
  const days = Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000);
  return ((days % length) + length) % length;
}

/** Today's model id. MMD_TODAY=YYYY-MM-DD overrides the date (for checking a build). */
export async function todaysModelId() {
  const schedule = await getEntry("schedule", "main");
  if (!schedule) throw new Error("src/data/schedule.json is missing");
  const today = process.env.MMD_TODAY ?? londonDate();
  const { start, order } = schedule.data;
  return order[dayIndex(start, today, order.length)];
}
