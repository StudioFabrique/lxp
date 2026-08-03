import { describe, expect, it } from "vitest";

import {
  buildImportProgressItems,
  type CourseImport,
} from "../hooks/useImportCourses";

describe("buildImportProgressItems", () => {
  it("liste la structure et chaque fichier du MBZ comme éléments en attente", () => {
    const courses = [
      {
        id: 10,
        title: "Cours Moodle",
        lessons: [
          {
            id: 20,
            title: "Introduction",
            activities: [
              {
                id: 30,
                title: "Support PDF",
                type: "file",
                url: "files/support.pdf",
              },
            ],
          },
        ],
      },
    ] as unknown as CourseImport[];

    expect(buildImportProgressItems(courses)).toEqual([
      expect.objectContaining({
        id: "course-10",
        title: "Cours Moodle",
        kind: "course",
        status: "pending",
      }),
      expect.objectContaining({
        id: "activity-10-20-30",
        title: "Support PDF",
        context: "Cours Moodle · Introduction",
        filename: "support.pdf",
        kind: "activity",
        status: "pending",
      }),
    ]);
  });
});
