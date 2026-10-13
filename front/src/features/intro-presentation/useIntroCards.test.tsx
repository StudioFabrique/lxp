import { act, useLayoutEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { introPresentationApi, introPresentationKeys } from "./intro-presentation.api";
import { useIntroCards } from "./useIntroCards";

vi.mock("../../store/AuthProvider", async () => {
  const { createContext } = await import("react");
  return { AuthContext: createContext({ user: { roles: [{ rank: 2 }] } }) };
});
const mode = vi.hoisted(() => ({ demoMode: false }));
vi.mock("../../store/DemoContext", () => ({ useDemoMode: () => mode }));

let container: HTMLDivElement;
let root: Root;
let client: QueryClient;
let current: ReturnType<typeof useIntroCards>;

const CardsProbe = () => {
  const value = useIntroCards(true);
  useLayoutEffect(() => { current = value; }, [value]);
  return <div>{value.cards.map((card) => card.title).join(", ")}</div>;
};

beforeEach(() => {
  mode.demoMode = false;
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  client.setQueryData(["instance-settings"], { name: "École" });
  client.setQueryData(["root-parcours"], [{
    id: 1, title: "Formation 1", level: "6",
    parcours: [{ id: 11, title: "Parcours 1" }, { id: 12, title: "Parcours 2" }],
  }]);
  for (const parcoursId of [11, 12]) {
    client.setQueryData(introPresentationKeys.parcours(parcoursId), { tags: [{ name: `Tag ${parcoursId}` }] });
    client.setQueryData(introPresentationKeys.modules(parcoursId), [
      { id: parcoursId * 10 + 1, title: "Module 1" },
      { id: parcoursId * 10 + 2, title: "Module 2" },
    ]);
    for (const index of [1, 2]) {
      const moduleId = parcoursId * 10 + index;
      client.setQueryData(introPresentationKeys.moduleDetail(moduleId), {
        data: {
          duration: moduleId,
          courses: [1, 2].map((courseIndex) => ({
            id: moduleId * 10 + courseIndex,
            title: `Cours ${moduleId}-${courseIndex}`,
            lessons: [1, 2].map((lessonIndex) => ({
              id: moduleId * 100 + courseIndex * 10 + lessonIndex,
              title: `Leçon ${moduleId}-${courseIndex}-${lessonIndex}`,
            })),
          })),
        },
      });
      for (const courseIndex of [1, 2]) {
        for (const lessonIndex of [1, 2]) {
          client.setQueryData(introPresentationKeys.lesson(moduleId * 100 + courseIndex * 10 + lessonIndex), {
            activities: [{ title: `Activité ${moduleId}-${courseIndex}-${lessonIndex}`, type: "text" }],
          });
        }
      }
    }
  }
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => root.render(<QueryClientProvider client={client}><CardsProbe /></QueryClientProvider>));
});
afterEach(() => {
  act(() => root.unmount());
  client.clear();
  vi.restoreAllMocks();
  container.remove();
});

describe("useIntroCards : sélection d’un sous-élément", () => {
  it("affiche le module 2 avec ses cours et ses détails", () => {
    act(() => current.onSelectChild(2, 1));
    expect(current.cards[3].title).toBe("Module 2");
    expect(current.cards[3].rows[0].title).toBe("Cours 112-1");
    expect(current.cards[3].details.find((detail) => detail.id === "module.duree")?.items[0].title).toBe("112 heures");
    expect(current.cards[4].title).toBe("Cours 112-1");
  });

  it("suit le cours puis la leçon cliqués jusqu’à leurs activités", () => {
    act(() => current.onSelectChild(3, 1));
    expect(current.cards[4].title).toBe("Cours 111-2");
    expect(current.cards[4].rows[0].title).toBe("Leçon 111-2-1");
    act(() => current.onSelectChild(4, 1));
    expect(current.cards[5].title).toBe("Leçon 111-2-2");
    expect(current.cards[5].rows[0].title).toBe("Activité 111-2-2");
    act(() => current.onSelectChild(5, 0));
    expect(current.cards[6].title).toBe("Activité 111-2-2");
  });

  it("réinitialise les descendants au changement de parcours malgré des titres de modules identiques", () => {
    act(() => current.onSelectChild(2, 1));
    act(() => current.onSelectChild(3, 1));
    act(() => current.onSelectChild(1, 1));
    expect(current.cards[2].title).toBe("Parcours 2");
    expect(current.cards[3].title).toBe("Module 1");
    expect(current.cards[4].title).toBe("Cours 121-1");
    expect(current.cards[5].title).toBe("Leçon 121-1-1");
  });

  it("conserve le module choisi pendant le chargement et après une erreur serveur", async () => {
    client.removeQueries({ queryKey: introPresentationKeys.moduleDetail(112) });
    const getModuleDetail = vi.spyOn(introPresentationApi, "getModuleDetail").mockRejectedValue(new Error("Indisponible"));
    act(() => current.onSelectChild(2, 1));
    expect(current.cards[3].title).toBe("Module 2");
    expect(current.isLoading).toBe(false);
    await act(async () => {
      await vi.waitFor(() => expect(client.getQueryState(introPresentationKeys.moduleDetail(112))?.status).toBe("error"));
    });
    expect(getModuleDetail).toHaveBeenCalledWith(112);
    expect(current.cards[3].title).toBe("Module 2");
    expect(current.cards[3].rows.every((item) => item.isPlaceholder)).toBe(true);
  });

  it("n’ajoute aucun exemple si le module réel n’a pas de cours", async () => {
    await act(async () => {
      client.setQueryData(introPresentationKeys.moduleDetail(111), { data: { courses: [] } });
      await vi.waitFor(() => expect(current.cards).toHaveLength(4));
    });
    expect(current.cards[3].title).toBe("Module 1");
    expect(current.cards[3].rows).toEqual([]);
    expect(current.cards[3].details).toEqual([]);
    act(() => current.onSelectChild(3, 0));
    expect(current.cards).toHaveLength(4);
  });

  it("conserve une formation réelle sans parcours et s’arrête à Formation", async () => {
    await act(async () => {
      client.setQueryData(["root-parcours"], [{ id: 1, title: "Formation vide", level: "5", parcours: [], canManage: true }]);
      await vi.waitFor(() => expect(current.cards).toHaveLength(2));
    });
    expect(current.selectedFormationId).toBe("current");
    expect(current.cards[1]).toMatchObject({ title: "Formation vide", rows: [] });
  });

  it("propose la formation actuelle et deux formations concrètes, et réinitialise les choix", () => {
    expect(current.formationOptions).toHaveLength(3);
    expect(current.formationOptions[0]).toMatchObject({ id: "current", title: "Formation 1" });
    act(() => current.onSelectFormation("hotel"));
    expect(current.cards[1].title).toBe("Réceptionniste en hôtellerie");
    expect(current.cards[3].title).toBe("Accueil à la réception");
    act(() => current.onSelectChild(2, 1));
    expect(current.cards[3].title).toBe("Relation client");
    expect(current.cards[4].title).toBe("Répondre aux demandes du séjour");
    act(() => current.onSelectFormation("current"));
    expect(current.cards[1].title).toBe("Formation 1");
    expect(current.cards[3].title).toBe("Module 1");
  });

  it("propose trois formations complètes en démonstration, sans reprendre le cache réel", () => {
    mode.demoMode = true;
    act(() => root.render(<QueryClientProvider client={client}><CardsProbe /></QueryClientProvider>));
    expect(current.formationOptions.map((item) => item.id)).toEqual(["web", "hotel", "payroll"]);
    act(() => current.onSelectFormation("payroll"));
    expect(current.cards[1].title).toBe("Gestionnaire de paie");
    expect(current.cards).toHaveLength(7);
    expect(current.cards[3].title).toBe("Dossier du salarié");
    expect(current.cards[4].title).toBe("Constituer un dossier d’embauche");
  });
});
