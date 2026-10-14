import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useParcoursEdit } from "./useParcoursEdit";

vi.mock("./useParcoursQuery", () => ({
  useParcoursQuery: () => ({ data: undefined, isLoading: false, error: null }),
}));

vi.mock("../api/parcours.api", () => ({
  parcoursApi: { mutations: { updateParcoursImage: vi.fn() } },
}));

type EditApi = ReturnType<typeof useParcoursEdit>;

describe("useParcoursEdit", () => {
  let root: Root;
  let container: HTMLDivElement;

  afterEach(async () => {
    if (root) await act(async () => root.unmount());
    container?.remove();
  });

  const mount = async (initialUrl: string) => {
    let api!: EditApi;
    let search = "";
    let navigate!: ReturnType<typeof useNavigate>;
    const Harness = () => {
      api = useParcoursEdit();
      search = useLocation().search;
      navigate = useNavigate();
      return null;
    };

    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    await act(async () => {
      root.render(
        <MemoryRouter initialEntries={[initialUrl]}>
          <Routes>
            <Route path="/admin/parcours/edit/:id" element={<Harness />} />
          </Routes>
        </MemoryRouter>,
      );
    });

    return {
      getApi: () => api,
      getSearch: () => search,
      getNavigate: () => navigate,
    };
  };

  it("reprend l'étape de l'URL après un rechargement", async () => {
    const { getApi, getSearch } = await mount("/admin/parcours/edit/12?step=6");

    expect(getApi().actualStep.id).toBe(6);
    expect(getSearch()).toBe("?step=6");
  });

  it("reflète le changement d'étape dans l'URL", async () => {
    const { getApi, getSearch } = await mount("/admin/parcours/edit/12?step=2");

    await act(async () => getApi().updateStep(5));

    expect(getApi().actualStep.id).toBe(5);
    expect(getSearch()).toBe("?step=5");
  });

  it("conserve les autres paramètres de l'URL", async () => {
    const { getApi, getSearch } = await mount(
      "/admin/parcours/edit/12?step=4&moduleId=3",
    );

    await act(async () => getApi().updateStep(5));

    expect(getSearch()).toBe("?step=5&moduleId=3");
  });

  it("suit un lien interne qui change l'étape sans la réécrire", async () => {
    const { getApi, getSearch, getNavigate } = await mount(
      "/admin/parcours/edit/12?step=5",
    );

    await act(async () => getNavigate()("?step=7"));

    expect(getApi().actualStep.id).toBe(7);
    expect(getSearch()).toBe("?step=7");
  });

  it("ramène toujours au calendrier depuis l'étape Étudiants", async () => {
    const { getApi, getSearch } = await mount("/admin/parcours/edit/12?step=6");

    await act(async () => getApi().handleRetour());

    expect(getApi().actualStep.id).toBe(5);
    expect(getSearch()).toBe("?step=5");
  });

  it("ignore une étape inconnue dans l'URL", async () => {
    const { getApi } = await mount("/admin/parcours/edit/12?step=99");

    expect(getApi().actualStep.id).toBe(1);
  });
});
