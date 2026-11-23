import type { DetailKind } from "../api/observability.api";

/** Identifiant du panneau de détail, référencé par `aria-controls` sur chaque bloc. */
export const detailPanelId = "activity-detail";

/** Un identifiant par bloc : le détail ouvert se déduit de lui. */
export type StatBlockId =
  | "logins"
  | "failed-logins"
  | "active-users"
  | "requests"
  | "client-errors"
  | "server-errors"
  | "performance-average"
  | "slow-requests";

export const detailKindOfBlock = (block: StatBlockId): DetailKind =>
  block === "performance-average" ? "performance" : block;
