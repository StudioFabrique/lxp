import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parcoursApi } from "../../../parcours/api/parcours.api";
import { parcoursKeys } from "../../../parcours/api/parcours.keys";
import type Parcours from "../../../../utils/interfaces/parcours";
import type { GroupFormValues } from "../../group.schema";
import GroupCreationTeachers from "./GroupCreationTeachers";

vi.mock("../../../parcours/api/parcours.api", () => ({
  parcoursApi: { queries: { getById: vi.fn() } },
}));

(
  globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let form: UseFormReturn<GroupFormValues>;

function CreationForm({ parcoursId }: { parcoursId: number }) {
  const methods = useForm<GroupFormValues>({
    defaultValues: { name: "Promotion", desc: "", formationId: 1, parcoursId },
  });
  useEffect(() => { form = methods; }, [methods]);
  return <FormProvider {...methods}><GroupCreationTeachers /></FormProvider>;
}

describe("formateurs lors de la création d'un groupe", () => {
  let root: Root;
  let container: HTMLDivElement;
  let client: QueryClient;

  afterEach(() => {
    act(() => root?.unmount());
    container?.remove();
    client?.clear();
    vi.resetAllMocks();
  });

  async function renderForm(parcoursId: number) {
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    container = document.createElement("div");
    document.body.append(container);
    await act(async () => {
      root = createRoot(container);
      root.render(
        <QueryClientProvider client={client}>
          <MemoryRouter><CreationForm parcoursId={parcoursId} /></MemoryRouter>
        </QueryClientProvider>,
      );
    });
  }

  async function expectText(text: string) {
    await act(async () => {
      await vi.waitFor(() => expect(container.textContent).toContain(text));
    });
  }

  it("affiche les formateurs du parcours présélectionné et suit les changements de parcours", async () => {
    vi.mocked(parcoursApi.queries.getById).mockImplementation(async (id) => ({
      id,
      title: "Parcours",
      formation: { id: 1, title: "Formation", level: "", code: "", tags: [] },
      contacts: [{ idMdb: String(id), firstname: id === 42 ? "Alice" : "Bob", lastname: "Martin", role: "Formateur", email: "prive@example.com", phone: "" }],
      tags: [], skills: [], bonusSkills: [], objectives: [], modules: [], groups: [],
      isPublished: false, author: "", visibility: false,
    }));
    await renderForm(42);
    await expectText("Alice Martin");
    expect(container.textContent).not.toContain("prive@example.com");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/admin/parcours/edit/42");
    await act(async () => form.setValue("parcoursId", 43));
    await expectText("Bob Martin");
    expect(container.textContent).not.toContain("Alice");
    expect(container.querySelector("a")?.getAttribute("href")).toBe("/admin/parcours/edit/43");
    await act(async () => {
      client.setQueryData<Parcours>(parcoursKeys.detail(43), (parcours) =>
        parcours ? { ...parcours, contacts: [] } : parcours,
      );
    });
    await expectText("Aucun formateur associé à ce parcours.");
    await act(async () => form.setValue("parcoursId", 0));
    expect(container.textContent).toContain("Sélectionnez un parcours");
    expect(container.textContent).not.toContain("Bob");
  });

  it("n'appelle pas l'API sans parcours sélectionné", async () => {
    await renderForm(0);
    expect(container.textContent).toContain("Sélectionnez un parcours");
    expect(parcoursApi.queries.getById).not.toHaveBeenCalled();
  });

  it("affiche le chargement, puis l'erreur et permet de réessayer", async () => {
    vi.mocked(parcoursApi.queries.getById).mockReturnValue(new Promise(() => {}));
    await renderForm(42);
    expect(container.textContent).toContain("Chargement des formateurs");
    vi.mocked(parcoursApi.queries.getById).mockRejectedValue(new Error("Échec"));
    await act(async () => { await client.cancelQueries(); await client.resetQueries(); });
    await expectText("Impossible de charger les formateurs");
    const calls = vi.mocked(parcoursApi.queries.getById).mock.calls.length;
    await act(async () => container.querySelector<HTMLButtonElement>("button")?.click());
    await expectText("Impossible de charger les formateurs");
    expect(parcoursApi.queries.getById).toHaveBeenCalledTimes(calls + 1);
  });
});
