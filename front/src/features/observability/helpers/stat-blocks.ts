import type { DetailKind } from "../api/observability.api";

/** Identifiant du panneau de détail, référencé par `aria-controls` sur chaque bloc. */
export const detailPanelId = "activity-detail";

/** Un identifiant par bloc : deux blocs peuvent ouvrir le même détail. */
export type StatBlockId =
  | "logins"
  | "failed-logins"
  | "active-users"
  | "requests"
  | "client-errors"
  | "server-errors"
  | "performance-average"
  | "performance-p95";

export const detailKindOfBlock = (block: StatBlockId): DetailKind =>
  block === "performance-average" || block === "performance-p95" ? "performance" : block;
