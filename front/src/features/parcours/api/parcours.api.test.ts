import { beforeEach, describe, expect, it, vi } from "vitest";

import apiClient from "../../../lib/axios";
import { parcoursApi } from "./parcours.api";

vi.mock("../../../lib/axios", () => ({
  default: {
    post: vi.fn(),
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
  });

  it("transmet le formateur et les modules choisis dans le formulaire", async () => {
    const archive = new File(["archive"], "parcours.zip", {
      type: "application/zip",
    });

    await parcoursApi.mutations.importParcours({
      archive,
      formationId: 3,
      teacherContactId: 7,
      teacherModuleIndexes: [0, 2],
      publishCourses: true,
    });

    const [url, body] = vi.mocked(apiClient.post).mock.calls[0];
    expect(url).toBe("/parcours/import");
    expect(body).toBeInstanceOf(FormData);
    const formData = body as FormData;
    expect(formData.get("archive")).toBe(archive);
    expect(formData.get("formationId")).toBe("3");
    expect(formData.get("teacherContactId")).toBe("7");
    expect(formData.get("teacherModuleIndexes")).toBe("[0,2]");
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
});
