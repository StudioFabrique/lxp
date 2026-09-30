import { jest } from "@jest/globals";
import JSZip from "jszip";
import { createModelMock } from "../../../../tests/utils/prisma-mock.ts";

const createCourse = jest.fn<(...args: any[]) => Promise<any>>();
const updateCourse = jest.fn<(...args: any[]) => Promise<any>>();
const course = createModelMock({ create: createCourse, update: updateCourse });
const tx = { orm: { public: {
  Formation: createModelMock({ first: jest.fn(async () => ({ id: 1 })) }),
  Parcours: createModelMock({ all: jest.fn(async () => []), create: jest.fn(async () => ({ id: 2, title: "Parcours" })) }),
  Module: createModelMock({ create: jest.fn(async () => ({ id: 3 })) }),
  Course: course,
} } };
jest.unstable_mockModule("../../../utils/db.ts", () => ({
  prisma: {
    orm: { public: { Admin: createModelMock({ first: jest.fn(async () => ({ id: 1 })) }) } },
    transaction: (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
  },
}));
jest.unstable_mockModule("../../../utils/interfaces/db/user.ts", () => ({
  default: { findById: jest.fn(async () => null) },
}));
const { importParcoursArchive } = await import("../parcours-archive.ts");

async function archive() {
  const importedCourse = {
    title: "Relation clientèle", description: null, image: null, virtualClass: null,
    visibility: true, scenario: false, isPublished: true, dates: [], order: 0,
    tags: [], quizzes: [], lessons: [], courseSlug: "slug-de-l-instance-source",
  };
  const zip = new JSZip();
  zip.file("manifest.json", JSON.stringify({
    format: "andria-parcours", version: 1, exportedAt: "2026-09-30T10:00:00.000Z", warnings: [],
    formation: { title: "Formation", description: null, code: null, level: "Débutant" },
    parcours: {
      title: "Parcours", description: null, startDate: null, endDate: null, degree: null,
      virtualClass: null, isPublished: false, image: null, thumb: null,
      objectives: [], tags: [], skills: [], bonusSkills: [],
      modules: [{
        title: "Module", description: null, quizInstructions: null, duration: null, rating: null,
        minDate: null, maxDate: null, image: null, thumb: null, bonusSkillKeys: [], quizzes: [],
        courses: [importedCourse, { ...importedCourse, order: 1 }],
      }],
    },
  }));
  return zip.generateAsync({ type: "nodebuffer" });
}

beforeEach(() => {
  jest.clearAllMocks();
  createCourse.mockResolvedValueOnce({ id: 50 }).mockResolvedValueOnce({ id: 51 });
  updateCourse.mockResolvedValue({});
});

it("attribue des slugs distincts aux cours importés dans la transaction", async () => {
  await expect(importParcoursArchive(await archive(), "admin")).resolves.toMatchObject({ success: true });
  expect(course.where).toHaveBeenCalledWith({ id: 50 });
  expect(course.where).toHaveBeenCalledWith({ id: 51 });
  expect(updateCourse).toHaveBeenNthCalledWith(1, { courseSlug: "relation-clientele-50" });
  expect(updateCourse).toHaveBeenNthCalledWith(2, { courseSlug: "relation-clientele-51" });
});

it("ne valide pas l'import si l'identité nécessaire à l'indexation ne peut pas être enregistrée", async () => {
  updateCourse.mockRejectedValueOnce(new Error("Échec de l'enregistrement du slug"));
  await expect(importParcoursArchive(await archive(), "admin")).rejects.toThrow("Échec de l'enregistrement du slug");
});
