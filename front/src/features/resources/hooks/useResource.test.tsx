import { act, useEffect } from "react";
import { createRoot, Root } from "react-dom/client";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { afterEach, describe, expect, it, vi } from "vitest";
import useResource from "./useResource";
import { resourcesApi } from "../api/resources.api";
vi.mock("../api/resources.api", () => ({ resourcesApi: {
  queries: { getDetails: vi.fn() }, mutations: { save: vi.fn(), removeActivity: vi.fn() },
} }));
vi.mock("react-hot-toast", () => ({ default: { success: vi.fn(), error: vi.fn() } }));
let root: Root;
let state: ReturnType<typeof useResource>;
let location: string;
let onResourceSaved: (() => void) | undefined;
const activities = [{ id: 10, title: "Texte", type: "text", url: "text.html", order: 0 }, { id: 11, title: "Image", type: "image", url: "image.png", order: 1 }];
const details = { id: 7, title: "Ressource", description: "Description", tags: [], activities };
function Harness() {
  const resource = useResource({ onResourceSaved });
  const route = useLocation();
  useEffect(() => { state = resource; location = route.pathname; });
  return <form><input {...resource.data.register("title")} /><input {...resource.data.register("description")} /></form>;
}
async function render(path = "/admin/resources/edit/7") {
  vi.mocked(resourcesApi.queries.getDetails).mockResolvedValue({ resourceDetails: details });
  root = createRoot(document.createElement("div"));
  await act(async () => root.render(<MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/admin/resources/edit/:resourceId" element={<Harness />} />
    <Route path="/admin/resources/add" element={<Harness />} />
  </Routes></MemoryRouter>));
}
afterEach(async () => {
  if (root) await act(async () => root.unmount());
  onResourceSaved = undefined;
  vi.clearAllMocks();
});
describe("Gestion d'une ressource supplémentaire", () => {
  it("ouvre directement l'activité choisie dans la liste", async () => {
    await render("/admin/resources/edit/7?activityId=11");
    expect(state.previewActivity?.id).toBe(11);
    expect(state.activityState).toBe("read");
  });
  it("conserve les activités lors de la mise à jour des informations", async () => {
    await render();
    vi.mocked(resourcesApi.mutations.save).mockResolvedValue({ success: true, message: "Enregistrée", resource: { id: 7, title: "Ressource" } });
    await act(async () => state.handleSubmitForm());
    expect(resourcesApi.mutations.save).toHaveBeenCalledWith(expect.any(FormData), 7);
    expect(state.resource?.activities).toEqual(activities);
  });
  it("ferme la modale uniquement après une mise à jour réussie", async () => {
    const closeModal = vi.fn();
    onResourceSaved = closeModal;
    await render();
    vi.mocked(resourcesApi.mutations.save)
      .mockRejectedValueOnce(new Error("Erreur"))
      .mockResolvedValueOnce({
        success: true,
        message: "Enregistrée",
        resource: { id: 7, title: "Ressource" },
      });

    await act(async () => state.handleSubmitForm());
    expect(closeModal).not.toHaveBeenCalled();

    await act(async () => state.handleSubmitForm());
    expect(closeModal).toHaveBeenCalledOnce();
  });
  it("passe en modification après la création et utilise PUT à l'enregistrement suivant", async () => {
    await render("/admin/resources/add");
    await act(async () => state.data.register("title").onChange({ target: { name: "title", value: "Ressource" }, type: "change" }));
    vi.mocked(resourcesApi.mutations.save).mockResolvedValue({ success: true, message: "Enregistrée", resource: details });
    await act(async () => state.handleSubmitForm());
    expect(location).toBe("/admin/resources/edit/7");
    expect(state.mode).toBe("update");
    await act(async () => state.handleSubmitForm());
    expect(resourcesApi.mutations.save).toHaveBeenLastCalledWith(expect.any(FormData), 7);
  });
  it("ne réutilise pas l'activité précédente lors d'une création", async () => {
    await render();
    await act(async () => state.createNewActivity("image"));
    expect(state.previewActivity).toBeNull();
    expect(state.activityState).toBe("write");
    expect(state.activityType).toBe("image");
    await act(async () => state.refreshActivityList(true));
    expect(state.previewActivity?.id).toBe(11);
    expect(state.activityState).toBe("read");
  });
  it("interdit l'ajout d'activité avant l'enregistrement de la ressource", async () => {
    await render("/admin/resources/add");
    await act(async () => state.createNewActivity("text"));
    expect(state.activityType).toBeNull();
  });
  it("supprime l'activité bonus puis actualise la sélection", async () => {
    await render();
    await act(async () => state.setActivityToDelete(state.previewActivity));
    vi.mocked(resourcesApi.mutations.removeActivity).mockResolvedValue({ success: true, message: "Supprimée" });
    vi.mocked(resourcesApi.queries.getDetails).mockResolvedValue({ resourceDetails: { ...details, activities: [activities[1]] } });
    await act(async () => state.handleDeleteActivity());
    expect(resourcesApi.mutations.removeActivity).toHaveBeenCalledWith("text", 10);
    expect(state.previewActivity?.id).toBe(11);
    expect(state.activityToDelete).toBeNull();
  });
});
