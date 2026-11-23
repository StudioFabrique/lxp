import apiClient from "../../../lib/axios";
import { BASE_API_URL } from "../../../config/urls";
import { rangeParams, type ActivityRange } from "../helpers/activity-range";

export const activityPeriods = ["24h", "7d", "30d"] as const;
export type ActivityPeriod = (typeof activityPeriods)[number];

export type ActivityUser = {
  id: string;
  name: string;
  role: string | null;
};

export type ActivityOverview = {
  totals: {
    requests: number;
    logins: number;
    loginUsers: number;
    activeUsers: number;
    clientErrors: number;
    serverErrors: number;
    failedLogins: number;
    avgResponseMs: number;
    p95ResponseMs: number;
  };
  /** Connexions par heure UTC ; le regroupement par heure locale se fait à l'affichage. */
  hourlyLogins: { time: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
  slowestRoutes: { method: string; path: string; avgMs: number; hits: number }[];
  /** `user` vaut `null` quand le compte a été supprimé. */
  recentLogins: { time: string; from: string; user: ActivityUser | null }[];
};

export type UserActivity = {
  user: ActivityUser | null;
  actions: {
    time: string;
    method: string;
    path: string;
    status: number;
    durationMs: number;
  }[];
};

export const detailKinds = [
  "logins",
  "failed-logins",
  "active-users",
  "requests",
  "client-errors",
  "server-errors",
  "performance",
] as const;
export type DetailKind = (typeof detailKinds)[number];

/** `userId` vaut `null` pour un visiteur non connecté ; `user` vaut `null` si le compte n'existe plus. */
export type ActivityEvent = {
  time: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  userId: string | null;
  user: ActivityUser | null;
};

export type ActivityDetails =
  | {
      kind: "logins";
      recent: { time: string; userId: string; from: string; user: ActivityUser | null }[];
      topUsers: { userId: string; count: number; user: ActivityUser | null }[];
    }
  | {
      kind: "failed-logins";
      byIp: { from: string; count: number; last: string }[];
      recent: { time: string; from: string; status: number }[];
    }
  | {
      kind: "active-users";
      users: { userId: string; hits: number; last: string; user: ActivityUser | null }[];
    }
  | {
      kind: "requests";
      topRoutes: { method: string; path: string; hits: number; avgMs: number }[];
      byMethod: { method: string; count: number }[];
    }
  | {
      kind: "client-errors" | "server-errors";
      byStatus: { status: string; count: number }[];
      topRoutes: { method: string; path: string; status: string; count: number }[];
      recent: ActivityEvent[];
    }
  | {
      kind: "performance";
      slowestRoutes: {
        method: string;
        path: string;
        avgMs: number;
        p95Ms: number;
        hits: number;
      }[];
    };

/** Interface de consultation détaillée (VictoriaLogs), servie par l'API. */
export const victoriaLogsUrl = `${BASE_API_URL}/observability/select/vmui/`;

export const observabilityApi = {
  queries: {
    getOverview: async (range: ActivityRange): Promise<ActivityOverview> => {
      const res = await apiClient.get<ActivityOverview>("/observability/overview", {
        params: rangeParams(range),
      });
      return res.data;
    },
    getDetails: async (
      kind: DetailKind,
      range: ActivityRange,
    ): Promise<ActivityDetails> => {
      const res = await apiClient.get<ActivityDetails>(
        `/observability/details/${kind}`,
        { params: rangeParams(range) },
      );
      return res.data;
    },
    getUserActivity: async (
      userId: string,
      range: ActivityRange,
    ): Promise<UserActivity> => {
      const res = await apiClient.get<UserActivity>(
        `/observability/users/${encodeURIComponent(userId)}/activity`,
        { params: rangeParams(range) },
      );
      return res.data;
    },
  },
};
