import { validationResult, type ValidationChain } from "express-validator";
import { randomQuizValidator } from "../quiz-validator.ts";

async function validate(attempt: Record<string, unknown>) {
  const req = { body: { content: "Contenu pédagogique pour le quiz", courseId: 5, ...attempt } };
  for (const validator of randomQuizValidator) {
    if ("run" in validator) await (validator as ValidationChain).run(req);
  }
  return validationResult(req).array();
}
it.each([{}, { attemptId: null }, { attemptId: 10 }])("accepte le contexte de quiz %j", async (attempt) => {
  expect(await validate(attempt)).toEqual([]);
});
it.each([{ attemptId: 0 }, { attemptId: -1 }, { attemptId: "invalide" }])("rejette une tentative invalide %j", async (attempt) => {
  expect(await validate(attempt)).toEqual([expect.objectContaining({ path: "attemptId" })]);
});
