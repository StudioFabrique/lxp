import fs from "node:fs";
import path from "node:path";

const sourceRoot = path.resolve(__dirname, "../..");

function typescriptFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return typescriptFiles(absolutePath);
    return entry.isFile() && entry.name.endsWith(".ts") ? [absolutePath] : [];
  });
}

function runtimeImports(source: string) {
  return [...source.matchAll(/^import\s+(?!type\b)[^;]+from\s+["']([^"']+)["'];?/gm)].map(
    (match) => match[1],
  );
}

describe("backend layering", () => {
  it("keeps routers independent from models and persistence", () => {
    for (const file of typescriptFiles(path.join(sourceRoot, "routes"))) {
      const imports = runtimeImports(fs.readFileSync(file, "utf8"));
      expect({ file, imports }).not.toEqual(
        expect.objectContaining({
          imports: expect.arrayContaining([
            expect.stringMatching(/(?:models|utils\/db|interfaces\/db)/),
          ]),
        }),
      );
    }
  });

  it("keeps controllers independent from routes and persistence clients", () => {
    for (const file of typescriptFiles(path.join(sourceRoot, "controllers"))) {
      const source = fs.readFileSync(file, "utf8");
      const imports = runtimeImports(source);
      expect({ file, imports }).not.toEqual(
        expect.objectContaining({
          imports: expect.arrayContaining([
            expect.stringMatching(/(?:routes|utils\/db|interfaces\/db)/),
          ]),
        }),
      );
      expect({ file, source }).not.toEqual(
        expect.objectContaining({ source: expect.stringMatching(/\bprisma\./) }),
      );
    }
  });

  it("keeps models independent from Express, routes and controllers", () => {
    for (const file of typescriptFiles(path.join(sourceRoot, "models"))) {
      const imports = runtimeImports(fs.readFileSync(file, "utf8"));
      expect({ file, imports }).not.toEqual(
        expect.objectContaining({
          imports: expect.arrayContaining([
            expect.stringMatching(/^(?:express|.*\/(?:routes|controllers)\/)/),
          ]),
        }),
      );
    }
  });
});
