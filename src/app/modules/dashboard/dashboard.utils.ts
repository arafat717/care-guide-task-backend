export type RangePreset = "week" | "month" | "year" | "all";

interface IResolvedRange {
  startDate: Date | null;
  endDate: Date;
  days: number;
  groupBy: "day" | "month";
}

/**
 * Accepts either a preset ("week" | "month" | "year" | "all")
 * or a raw number of days (e.g. "7", "30", "90") via `range` query param.
 */
export const resolveRange = (rangeInput?: string): IResolvedRange => {
  const endDate = new Date();
  const preset = (rangeInput || "month").toLowerCase();

  let days: number;
  switch (preset) {
    case "week":
      days = 7;
      break;
    case "month":
      days = 30;
      break;
    case "year":
      days = 365;
      break;
    case "all":
      return { startDate: null, endDate, days: 0, groupBy: "month" };
    default: {
      const parsed = Number(preset);
      days = Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
    }
  }

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days);

  const groupBy = days > 120 ? "month" : "day";

  return { startDate, endDate, days, groupBy };
};
