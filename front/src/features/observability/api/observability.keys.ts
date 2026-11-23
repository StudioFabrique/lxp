import { rangeKey, type ActivityRange } from "../helpers/activity-range";
import type { DetailKind } from "./observability.api";

export const observabilityKeys = {
  all: ["observability"] as const,
  overview: (range: ActivityRange) =>
    [...observabilityKeys.all, "overview", rangeKey(range)] as const,
  details: (kind: DetailKind, range: ActivityRange) =>
    [...observabilityKeys.all, "details", kind, rangeKey(range)] as const,
  userActivity: (userId: string, range: ActivityRange) =>
    [...observabilityKeys.all, "user-activity", userId, rangeKey(range)] as const,
};
