export type ParcoursImportOptions = {
  formationId?: number;
  teacherContactId?: number;
  teacherModuleIndexes: number[];
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
  const teacherContactId = optionalPositiveInteger(
    fields.teacherContactId,
    "La ressource pédagogique sélectionnée n'est pas valide.",
  );

  let teacherModuleIndexes: unknown = [];
  if (
    fields.teacherModuleIndexes !== undefined &&
    fields.teacherModuleIndexes !== ""
  ) {
    try {
      teacherModuleIndexes = JSON.parse(String(fields.teacherModuleIndexes));
    } catch {
      throw badRequest("La sélection des modules n'est pas valide.");
    }
  }
  if (
    !Array.isArray(teacherModuleIndexes) ||
    teacherModuleIndexes.length > 10_000 ||
    teacherModuleIndexes.some(
      (index) => !Number.isInteger(index) || Number(index) < 0,
    )
  ) {
    throw badRequest("La sélection des modules n'est pas valide.");
  }
  if (teacherContactId === undefined && teacherModuleIndexes.length > 0) {
    throw badRequest(
      "Une ressource pédagogique doit être sélectionnée pour l'associer aux modules.",
    );
  }

  return {
    formationId,
    teacherContactId,
    teacherModuleIndexes: [
      ...new Set(teacherModuleIndexes.map((index) => Number(index))),
    ],
  };
}
