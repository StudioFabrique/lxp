import { beforeEach, describe, expect, it, vi } from "vitest";

import apiClient from "../../../lib/axios";
import { parcoursApi } from "./parcours.api";

vi.mock("../../../lib/axios", () => ({
  default: {
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("parcoursApi.mutations.importParcours", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiClient.post).mockResolvedValue({
      data: {
        success: true,
        parcoursId: 12,
        title: "Parcours importé",
        warnings: [],
      },
    });
    vi.mocked(apiClient.patch).mockResolvedValue({
      data: {
        success: true,
        message: "Ressources affectées",
        assignmentsCreated: 2,
      },
    });
  });

  it("transmet uniquement les options d'import du parcours", async () => {
    const archive = new File(["archive"], "parcours.zip", {
      type: "application/zip",
    });

    await parcoursApi.mutations.importParcours({
      archive,
      formationId: 3,
      publishCourses: true,
    });

    const [url, body] = vi.mocked(apiClient.post).mock.calls[0];
    expect(url).toBe("/parcours/import");
    expect(body).toBeInstanceOf(FormData);
    const formData = body as FormData;
    expect(formData.get("archive")).toBe(archive);
    expect(formData.get("formationId")).toBe("3");
    expect(formData.get("teacherContactId")).toBeNull();
    expect(formData.get("teacherModuleIndexes")).toBeNull();
    expect(formData.get("publishCourses")).toBe("true");
  });

  it("laisse les cours en brouillon par défaut", async () => {
    const archive = new File(["archive"], "parcours.zip", {
      type: "application/zip",
    });

    await parcoursApi.mutations.importParcours({ archive });

    const [, body] = vi.mocked(apiClient.post).mock.calls[0];
    expect((body as FormData).get("publishCourses")).toBe("false");
  });

  it("affecte des ressources pédagogiques aux modules sélectionnés", async () => {
    await parcoursApi.mutations.assignModuleContacts({
      parcoursId: 12,
      moduleIds: [2, 3],
      contactIds: [7],
    });

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/modules/parcours/12/contacts",
      { moduleIds: [2, 3], contactIds: [7] },
    );
  });

  it("ajoute des compétences aux modules sélectionnés", async () => {
    await parcoursApi.mutations.assignModuleSkills({
      parcoursId: 12,
      moduleIds: [2, 3],
      skillIds: [9],
    });

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/modules/parcours/12/skills",
      { moduleIds: [2, 3], skillIds: [9] },
    );
  });

  it("transmet les associations avec les noms attendus lors d'une duplication", async () => {
    await parcoursApi.mutations.duplicateModule(4, {
      duration: 2,
      contactsIds: [7],
      skillsIds: [9],
      parcoursId: 12,
    });

    expect(apiClient.post).toHaveBeenCalledWith("/modules/duplicate/4", {
      duration: 2,
      contacts: [7],
      skills: [9],
      parcoursId: 12,
    });
  });
});
