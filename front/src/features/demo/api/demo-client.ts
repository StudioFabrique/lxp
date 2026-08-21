import axios from "axios";
import { BASE_API_URL } from "../../../config/urls";
import type { DemoChallenge, DemoSolution } from "../lib/altcha-solver";

/**
 * Client dédié à la page publique de démonstration.
 *
 * Volontairement dépourvu des intercepteurs de `lib/axios` : ceux-ci réagissent
 * à un 401 en tentant un rafraîchissement de session puis une déconnexion, ce
 * qui n'a aucun sens pour un visiteur qui n'a pas encore de session. L'API de
 * démonstration répond d'ailleurs en 400, 429 ou 503, jamais en 401 ni 403.
 */
const demoClient = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true,
});

export type DemoProfile = "admin" | "student";

export const demoApi = {
  getChallenge: async () =>
    (await demoClient.get<DemoChallenge>("/demo/challenge")).data,

  openSession: async (profile: DemoProfile, solution: DemoSolution) =>
    (
      await demoClient.post<{ ok: boolean; layout: "admin" | "student" }>(
        "/demo/session",
        { profile, solution },
      )
    ).data,
};

export default demoClient;
