import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import lessonRouter from "../lesson.router.ts";
import {
  getLessonsByTagValidator,
  getLessonsToImportValidator,
} from "../lesson-validator.ts";

type RouteLayer = {
  route?: { path: string; stack: Array<{ handle: unknown }> };
};

/** Middlewares déclarés pour une route GET du routeur des leçons. */
const handlersOf = (path: string): unknown[] => {
  const layer = (lessonRouter.stack as RouteLayer[]).find(
    (item) => item.route?.path === path,
  );
  return layer?.route?.stack.map((item) => item.handle) ?? [];
};

type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => unknown | Promise<unknown>;

/** Exécute une chaîne de validateurs et retourne le statut HTTP de rejet, ou `null` si la requête passe. */
async function runValidators(
  validators: unknown[],
  request: { params?: Record<string, string>; query?: Record<string, string> },
): Promise<number | null> {
  const req = {
    params: {},
    query: {},
    body: {},
    socket: { remoteAddress: "127.0.0.1" },
    ...request,
  } as unknown as Request;
  let status: number | null = null;
  const res = {
    status: (code: number) => {
      status = code;
      return { json: jest.fn() };
    },
  } as unknown as Response;

  for (const validator of validators as Middleware[]) {
    let proceeded = false;
    await validator(req, res, () => {
      proceeded = true;
    });
    if (!proceeded) break;
  }
  return status;
}

describe("validation des routes d'import de leçons", () => {
  it("n'impose pas `limit` à la route de recherche par tag", () => {
    const tagRoute = handlersOf("/tag/:tagId");
    const allTagsRoute = handlersOf("/tag");

    // Le validateur exclusif à la liste de tous les tags est l'exigence de `limit`, juste avant `checkValidatorResult`.
    const requiresLimit = getLessonsToImportValidator.at(-2);

    expect(tagRoute.length).toBeGreaterThan(0);
    expect(tagRoute).not.toContain(requiresLimit);
    expect(allTagsRoute).toContain(requiresLimit);
  });

  it("accepte la recherche par tag sans limite", async () => {
    const status = await runValidators(getLessonsByTagValidator, {
      params: { tagId: "3" },
      query: { includeCourseContents: "true", supplementaryResources: "true" },
    });

    expect(status).toBeNull();
  });

  it("exige toujours une limite pour la liste de tous les tags", async () => {
    const status = await runValidators(getLessonsToImportValidator, {
      query: { includeCourseContents: "true" },
    });

    expect(status).toBe(400);
  });
});
