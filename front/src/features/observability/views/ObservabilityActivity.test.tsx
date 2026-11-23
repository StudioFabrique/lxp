import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../../store/AuthProvider";
import {
  observabilityApi,
  type ActivityOverview,
} from "../api/observability.api";
vi.mock("react-apexcharts", () => ({
  default: () => <div data-testid="chart" />,
}));

import { formatDateToYYYYMMDD } from "../../../utils/helpers/convert-date";
import { addDays } from "../observability.schema";
import { SCROLL_DELAY_MS } from "../helpers/scroll-to-element";
import ObservabilityActivity from "./ObservabilityActivity";
import { formatNumber } from "../../../utils/helpers/format-number";

const overview: ActivityOverview = {
  totals: {
    requests: 12345, logins: 9, loginUsers: 2, activeUsers: 5, clientErrors: 3, serverErrors: 1,
    failedLogins: 4, avgResponseMs: 45, p95ResponseMs: 97,
  },
  hourlyLogins: [
    { time: new Date(2026, 10, 23, 9, 30).toISOString(), count: 3 },
    { time: new Date(2026, 10, 24, 9, 30).toISOString(), count: 2 },
  ],
  statusBreakdown: [
    { status: "200", count: 100 },
    { status: "500", count: 1 },
  ],
  slowestRoutes: [{ method: "POST", path: "/v1/chatbot/prompt", avgMs: 1643, hits: 4 }],
  recentLogins: [
    { time: "2026-11-23T10:00:00Z", from: "::1", user: { id: "6b0442fd94346451f219a8fd", name: "Camille Martin", role: "superadmin" } },
    { time: "2026-11-23T09:00:00Z", from: "10.0.0.2", user: null },
  ],
};

describe("page Journaux de l'instance", () => {
  let root: Root;
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    act(() => root?.unmount());
    container.remove();
    vi.restoreAllMocks();
  });

  const show = async (rank: number) => {
    act(() => {
      root = createRoot(container);
      root.render(
        <QueryClientProvider client={new QueryClient()}>
          <MemoryRouter>
            <AuthContext value={{ user: { roles: [{ rank }] } } as never}>
              <ObservabilityActivity />
            </AuthContext>
          </MemoryRouter>
        </QueryClientProvider>,
      );
    });
    await flush();
  };

  // TanStack Query notifie ses observateurs via un timer : attendre un tour de boucle.
  const flush = async () => {
    for (let i = 0; i < 3; i += 1) {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    }
  };

  it("refuse l'accès à un utilisateur qui n'est pas root, sans appeler l'API", async () => {
    const getOverview = vi.spyOn(observabilityApi.queries, "getOverview");
    await show(1);
    expect(container.querySelector('[role="alert"]')?.textContent).toContain("pas accès");
    expect(getOverview).not.toHaveBeenCalled();
  });

  it("affiche les statistiques, les noms et le bouton vers VictoriaLogs", async () => {
    vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue(overview);
    await show(0);
    expect(container.textContent).toContain(formatNumber(12345));
    expect(container.textContent).toContain("Camille Martin");
    expect(container.textContent).toContain("Compte supprimé");
    const detail = container.querySelector<HTMLAnchorElement>('a[href$="/observability/select/vmui/"]');
    expect(detail?.textContent).toContain("Consulter en détail");
    expect(detail?.rel).toContain("noopener");
  });

  it("résume la fréquentation par heure de la journée", async () => {
    vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue(overview);
    await show(0);
    expect(container.querySelector('[data-testid="chart"]')).not.toBeNull();
    expect(container.textContent).toContain("Pic à 9 h : 5 connexions sur 5");
  });

  // Le défilement part après un court délai, une fois la page stabilisée.
  const waitForScroll = () =>
    act(async () => {
      await new Promise((resolve) => setTimeout(resolve, SCROLL_DELAY_MS + 50));
    });

  const stat = (label: string) =>
    [...container.querySelectorAll<HTMLButtonElement>("button[aria-controls]")].find((button) =>
      button.getAttribute("aria-label")?.startsWith(label),
    );

  it("ouvre le détail d'une statistique au clic et le referme au second clic", async () => {
    vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue(overview);
    const getDetails = vi.spyOn(observabilityApi.queries, "getDetails").mockResolvedValue({
      kind: "server-errors",
      byStatus: [{ status: "503", count: 1 }],
      topRoutes: [{ method: "POST", path: "/v1/indicators/:id/prediction", status: "503", count: 1 }],
      recent: [
        { time: "2026-11-23T10:00:00Z", method: "POST", path: "/v1/indicators/x/prediction", status: 503, durationMs: 39, userId: "6b0442fd94346451f219a8fd", user: { id: "6b0442fd94346451f219a8fd", name: "Camille Martin", role: "superadmin" } },
        { time: "2026-11-23T09:00:00Z", method: "GET", path: "/v1/a", status: 500, durationMs: 5, userId: null, user: null },
        { time: "2026-11-23T08:00:00Z", method: "GET", path: "/v1/b", status: 500, durationMs: 5, userId: "aaaaaaaaaaaaaaaaaaaaaaaa", user: null },
      ],
    });
    await show(0);

    await act(async () => stat("Erreurs côté serveur")?.click());
    await flush();
    expect(getDetails).toHaveBeenCalledWith("server-errors", { kind: "preset", period: "24h" });
    expect(container.querySelector('[role="region"]')?.textContent).toContain("Détail des erreurs côté serveur");
    expect(container.textContent).toContain("Service indisponible");
    expect(container.textContent).toContain("Visiteur non connecté");
    expect(container.textContent).toContain("Compte supprimé");

    await act(async () => stat("Erreurs côté serveur")?.click());
    expect(container.querySelector('[role="region"]')).toBeNull();
  });

  it("fait défiler vers le détail à chaque ouverture, même pour un détail déjà affiché", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue(overview);
    vi.spyOn(observabilityApi.queries, "getDetails").mockResolvedValue({ kind: "performance", slowestRoutes: [] });
    await show(0);

    await act(async () => stat("Temps de réponse moyen")?.click());
    await flush();
    expect(scrollIntoView).not.toHaveBeenCalled();
    await waitForScroll();
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start", behavior: "smooth" });

    // Autre bloc, même détail : il reste ouvert et le défilement est relancé.
    await act(async () => stat("95e centile")?.click());
    await flush();
    expect(container.querySelector('[role="region"]')).not.toBeNull();
    expect(stat("95e centile")?.getAttribute("aria-pressed")).toBe("true");
    expect(stat("Temps de réponse moyen")?.getAttribute("aria-pressed")).toBe("false");
    await waitForScroll();
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it("ramène au bloc d'origine quand on ferme le détail avec la croix", async () => {
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue(overview);
    vi.spyOn(observabilityApi.queries, "getDetails").mockResolvedValue({ kind: "requests", topRoutes: [], byMethod: [] });
    await show(0);

    const block = stat("Requêtes");
    await act(async () => block?.click());
    await flush();
    scrollIntoView.mockClear();

    const close = container.querySelector<HTMLButtonElement>('button[aria-label="Fermer le détail"]');
    await act(async () => close?.click());

    expect(container.querySelector('[role="region"]')).toBeNull();
    expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ block: "center" }));
    expect(document.activeElement).toBe(block);
  });

  it("replie les listes longues de l'aperçu et ouvre les sections du détail", async () => {
    vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue(overview);
    vi.spyOn(observabilityApi.queries, "getDetails").mockResolvedValue({ kind: "performance", slowestRoutes: [] });
    await show(0);

    const overviewSections = [...container.querySelectorAll("details")];
    expect(overviewSections.map((section) => section.querySelector("summary")?.textContent)).toEqual([
      "Routes les plus lentes1",
      "Dernières connexions2",
    ]);
    // Replié, l'aperçu garde les premières lignes visibles.
    const loginsCard = overviewSections[1].parentElement as HTMLElement;
    expect(loginsCard.textContent).toContain("Camille Martin");
    expect(overviewSections.every((section) => !section.open)).toBe(true);

    await act(async () => stat("Requêtes")?.click());
    await flush();
    const panelSection = container.querySelector('[role="region"] details');
    expect(panelSection).not.toBeNull();
    expect((panelSection as HTMLDetailsElement).open).toBe(true);
  });

  it("cible un intervalle de dates depuis le bouton calendrier", async () => {
    const getOverview = vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue(overview);
    await show(0);

    const calendar = container.querySelector<HTMLButtonElement>('button[aria-label="Choisir un intervalle de dates"]');
    expect(calendar).not.toBeNull();
    await act(async () => calendar?.click());
    await flush();

    expect(document.body.textContent).toContain("Cibler un intervalle");
    const apply = [...document.querySelectorAll("button")].find((button) => button.textContent === "Appliquer");
    await act(async () => apply?.click());
    await flush();

    const today = formatDateToYYYYMMDD(new Date());
    expect(getOverview).toHaveBeenLastCalledWith({
      kind: "custom",
      startDate: addDays(today, -6),
      endDate: today,
    });
    // L'intervalle actif est signalé sur le bouton, et plus aucune période n'est sélectionnée.
    expect(container.querySelector('button[aria-label^="Intervalle personnalisé"]')?.getAttribute("aria-pressed")).toBe("true");
    expect([...container.querySelectorAll("button")].find((button) => button.textContent === "24 heures")?.getAttribute("aria-pressed")).toBe("false");
  });

  it("déplie une section depuis « Voir tout » sans perdre le focus", async () => {
    vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue({
      ...overview,
      recentLogins: Array.from({ length: 5 }, (_, index) => ({
        time: `2026-11-23T1${index}:00:00Z`,
        from: "::1",
        user: null,
      })),
    });
    await show(0);

    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;
    const expand = [...container.querySelectorAll("button")].find((button) =>
      button.textContent?.startsWith("Voir tout"),
    );
    expect(expand).not.toBeUndefined();
    await act(async () => expand?.click());

    // La section remonte à la hauteur de son titre, en douceur, après le délai.
    expect(scrollIntoView).not.toHaveBeenCalled();
    await waitForScroll();
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start", behavior: "smooth" });

    const section = expand?.closest("div[class*='rounded-lg']")?.querySelector("details");
    expect(section?.open).toBe(true);
    expect(document.activeElement).toBe(section?.querySelector("summary"));
  });

  it("propose les huit indicateurs cliquables", async () => {
    vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue(overview);
    await show(0);
    expect(container.querySelectorAll("button[aria-controls]")).toHaveLength(8);
    expect(stat("Échecs de connexion")?.getAttribute("aria-label")).toContain(": 4.");
  });

  it("change de période et recharge les statistiques", async () => {
    const getOverview = vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue(overview);
    await show(0);
    const sevenDays = [...container.querySelectorAll("button")].find((button) => button.textContent === "7 jours");
    await act(async () => sevenDays?.click());
    await flush();
    expect(getOverview).toHaveBeenLastCalledWith({ kind: "preset", period: "7d" });
  });

  it("ouvre l'activité d'une personne depuis ses connexions", async () => {
    vi.spyOn(observabilityApi.queries, "getOverview").mockResolvedValue(overview);
    const getUserActivity = vi.spyOn(observabilityApi.queries, "getUserActivity").mockResolvedValue({
      user: null,
      actions: [{ time: "2026-11-23T10:00:00Z", method: "GET", path: "/v1/formation", status: 200, durationMs: 12 }],
    });
    await show(0);
    const open = container.querySelector<HTMLButtonElement>('button[aria-label^="Voir l\'activité de"]');
    await act(async () => open?.click());
    await flush();
    expect(getUserActivity).toHaveBeenCalledWith("6b0442fd94346451f219a8fd", { kind: "preset", period: "24h" });
    expect(open?.getAttribute("aria-label")).toBe("Voir l'activité de Camille Martin");
    // Le nom n'est plus cliquable : seul le bouton d'action ouvre le tiroir.
    expect([...container.querySelectorAll("button")].some((button) => button.textContent === "Camille Martin")).toBe(false);
    expect(document.body.textContent).toContain("/v1/formation");
  });

  it("affiche une erreur avec une action possible quand les journaux sont indisponibles", async () => {
    vi.spyOn(observabilityApi.queries, "getOverview").mockRejectedValue(new Error("502"));
    await show(0);
    expect(container.querySelector('[role="alert"]')?.textContent).toContain("Réessayer");
  });
});
