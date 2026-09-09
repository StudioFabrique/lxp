export type ParcoursImportOptions = {
  formationId?: number;
  createFormation: boolean;
  publishCourses: boolean;
};

function badRequest(message: string) {
  return Object.assign(new Error(message), { statusCode: 400 });
}

function optionalPositiveInteger(value: unknown, errorMessage: string) {
  if (value === undefined || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw badRequest(errorMessage);
  return parsed;
}

function optionalBoolean(value: unknown, errorMessage: string) {
  if (value === undefined || value === "") return false;
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  throw badRequest(errorMessage);
}

export function parseParcoursImportOptions(
  body: unknown,
): ParcoursImportOptions {
  const fields =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};
  const formationId = optionalPositiveInteger(
    fields.formationId,
    "La formation sélectionnée n'est pas valide.",
  );
  const publishCourses = optionalBoolean(
    fields.publishCourses,
    "L'option de publication des cours n'est pas valide.",
  );
  const createFormation = optionalBoolean(
    fields.createFormation,
    "L'option de création de la formation n'est pas valide.",
  );
  if (formationId !== undefined && createFormation) {
    throw badRequest(
      "Sélectionnez une formation existante ou créez-en une nouvelle, pas les deux.",
    );
  }

  return {
    formationId,
    createFormation,
    publishCourses,
  };
}
