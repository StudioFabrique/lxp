import { describe, expect, it, vi } from "vitest";
import apiClient from "../../../lib/axios";
import { resourcesApi } from "./resources.api";
vi.mock("../../../lib/axios", () => ({ default: { post: vi.fn(), put: vi.fn() } }));
describe("Réponses des activités supplémentaires", () => {
  it("reconnaît la création de texte renvoyée directement par l'API", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { id: 12, type: "text" } });
    expect(await resourcesApi.mutations.saveTextActivity(7, { parent: "resource" }, false)).toMatchObject({ success: true });
  });
  it("enregistre l'iframe dans les activités bonus et reconnaît sa réponse", async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: { id: 12, type: "iframe" } });
    expect(await resourcesApi.mutations.saveIframeActivity(12, { title: "Animation", url: "https://example.com" }, true)).toMatchObject({ success: true });
    expect(apiClient.put).toHaveBeenCalledWith("/activity/iframe/12", { title: "Animation", url: "https://example.com", parent: "resource" });
  });
});
