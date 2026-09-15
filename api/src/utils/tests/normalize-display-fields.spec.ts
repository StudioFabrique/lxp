import { normalizeDisplayFields } from "../normalize-display-fields.ts";
import User from "../interfaces/db/user.ts";
import Group from "../interfaces/db/group.ts";

describe("display field storage", () => {
  it("normalizes nested creates without modifying JSON, URLs, files or filters", () => {
    const args = {
      where: { title: "Existing Title" },
      data: {
        title: "ÉCOLE DU NUMÉRIQUE",
        description: "<p>JavaScript et API</p>",
        modules: { create: [{ title: "MODULE A", courses: { create: {
          title: "COURS A", dates: [{ title: "JSON Preserved" }],
          lessons: { create: { title: "LEÇON", activities: { create: {
            title: "ACTIVITÉ", url: "https://example.org/File.PDF",
          } } } },
        } } }] },
      },
    };
    normalizeDisplayFields("Parcours", "update", args);
    expect(args.where.title).toBe("Existing Title");
    expect(args.data.title).toBe("école du numérique");
    expect(args.data.description).toBe("<p>JavaScript et API</p>");
    const course = args.data.modules.create[0].courses.create;
    expect(course.title).toBe("cours a");
    expect(course.dates[0].title).toBe("JSON Preserved");
    expect(course.lessons.create.activities.create).toEqual({ title: "activité", url: "https://example.org/File.PDF" });
    const file = { data: { name: "MyFile.PNG" } };
    normalizeDisplayFields("Mediatheque", "create", file);
    expect(file.data.name).toBe("MyFile.PNG");
  });

  it("handles bulk writes, set, upsert and nested update variants", () => {
    const args = { create: { title: "NEW" }, update: { title: { set: "UPDATED" },
      modules: {
        update: [{ where: { id: 1 }, data: { title: "MODULE" } }],
        upsert: { where: { id: 2 }, create: { title: "CREATE" }, update: { title: "UPDATE" } },
        createMany: { data: [{ title: "BULK" }] },
      },
    } };
    normalizeDisplayFields("Parcours", "upsert", args);
    expect(args.create.title).toBe("new");
    expect(args.update.title.set).toBe("updated");
    expect(args.update.modules.update[0].data.title).toBe("module");
    expect(args.update.modules.upsert.create.title).toBe("create");
    expect(args.update.modules.upsert.update.title).toBe("update");
    expect(args.update.modules.createMany.data[0].title).toBe("bulk");
    const tag = { data: [{ name: "ÉTIQUETTE", color: "#ABCDEF" }] };
    normalizeDisplayFields("Tag", "createMany", tag);
    expect(tag.data[0]).toEqual({ name: "étiquette", color: "#ABCDEF" });
  });

  it("matches normalized unique labels when importing the same tag again", () => {
    const args = { where: { name: "ÉTIQUETTE" }, create: { name: "ÉTIQUETTE" } };
    normalizeDisplayFields("Tag", "connectOrCreate", args);
    expect(args.where.name).toBe("étiquette");
    expect(args.create.name).toBe("étiquette");
  });

  it("does not change reads and nullable titles", () => {
    const args = { where: { title: "ABC" }, data: { title: "ABC" } };
    normalizeDisplayFields("Course", "findMany", args);
    expect(args.data.title).toBe("ABC");
    const nullable = { data: { title: null } };
    normalizeDisplayFields("Activity", "update", nullable);
    expect(nullable.data.title).toBeNull();
  });

  it("normalizes Mongo identities on construction and reassignment", () => {
    const user = new User({ firstname: "ÉLODIE", lastname: "D'ARC", password: "SecretABC", description: "JavaScript" });
    expect(user.firstname).toBe("élodie");
    expect(user.lastname).toBe("d'arc");
    user.firstname = "JEAN-PIERRE";
    expect(user.firstname).toBe("jean-pierre");
    expect(user.password).toBe("SecretABC");
    expect(user.description).toBe("JavaScript");
    expect(new Group({ name: "GROUPE A" }).name).toBe("groupe a");
    const setter = User.schema.path("firstname") as unknown as { applySetters: (value: string, context: unknown) => string };
    expect(setter.applySetters("ÉLODIE", User.updateOne({}, { firstname: "ÉLODIE" }))).toBe("élodie");
  });
});
