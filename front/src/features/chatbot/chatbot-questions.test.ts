import { describe, expect, it } from "vitest";
import { buildChatbotQuestions, chatbotQuestionKey, pickSelectionPrompts } from "./chatbot-questions";
import type { ChatbotTutorial } from "./chatbot-tutorials";

const tutorials: ChatbotTutorial[] = [{ id: "menu", label: "À quoi servent les menus ?", steps: [] }];
const base = { aiEnabled: true, aiUnavailable: false, hasTextSelection: false, canSuggestQuiz: false, tutorials, selectionPrompts: ["Résume ce passage."] };
const kinds = (context = base) => buildChatbotQuestions(context).map((question) => question.kind);

describe("questions de l'assistant virtuel", () => {
  it("propose la question libre et les tutoriels par défaut", () => {
    expect(kinds()).toEqual(["input", "tutorial"]);
  });

  it("ajoute le quiz sur une activité assez longue", () => {
    expect(kinds({ ...base, canSuggestQuiz: true })).toEqual(["input", "quiz", "tutorial"]);
  });

  it("propose des questions sur le passage sélectionné plutôt que les tutoriels", () => {
    expect(kinds({ ...base, hasTextSelection: true })).toEqual(["prompt", "input"]);
  });

  it("ne garde que les tutoriels quand l'IA est désactivée, même sur une activité ou une sélection", () => {
    expect(kinds({ ...base, aiEnabled: false, canSuggestQuiz: true, hasTextSelection: true })).toEqual(["tutorial"]);
  });

  it("n'envoie plus de question à l'IA quand elle est indisponible : ni quiz ni suggestions, mais le champ reste pour l'historique", () => {
    expect(kinds({ ...base, aiUnavailable: true, canSuggestQuiz: true, hasTextSelection: true })).toEqual(["input", "tutorial"]);
  });

  it("donne une clé distincte à chaque entrée", () => {
    const keys = buildChatbotQuestions({ ...base, canSuggestQuiz: true }).map(chatbotQuestionKey);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("suggestions sur un passage", () => {
  const prompts = ["a", "b", "c"];
  it("retourne le nombre demandé, sans doublon", () => {
    const picked = pickSelectionPrompts(prompts, 0.9, "texte");
    expect(picked).toHaveLength(2);
    expect(new Set(picked).size).toBe(2);
  });

  it("est stable pour un même passage et ne dépasse pas la liste", () => {
    expect(pickSelectionPrompts(prompts, 0.4, "texte")).toEqual(pickSelectionPrompts(prompts, 0.4, "texte"));
    expect(pickSelectionPrompts(["seule"], 0.4, "x")).toEqual(["seule"]);
    expect(pickSelectionPrompts([], 0.4, "x")).toEqual([]);
  });
});
