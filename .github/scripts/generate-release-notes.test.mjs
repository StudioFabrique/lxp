import assert from "node:assert/strict";
import { test } from "node:test";
import {
  generateContent,
  isTextOnlyCorrection,
  parseCommits,
  readerFriendlySubject,
  updateNotes,
  validateContent,
  versionFromBranch,
} from "./generate-release-notes.mjs";

test("lit la version de la branche de patch", () => {
  assert.equal(versionFromBranch("release/0.9.1"), "0.9.1");
  assert.equal(versionFromBranch("release/v0.9.2"), "0.9.2");
  assert.throws(() => versionFromBranch("release/0.9"));
  assert.throws(() => versionFromBranch("feature/0.9.1"));
});

test("exclut les commits générés des résumés suivants", () => {
  const first = "a".repeat(40);
  const generated = "b".repeat(40);
  const log =
    `${first}\x1ffix(front): clarifier les erreurs\x1fUn texte utile.\x1e\n` +
    `${generated}\x1fchore(release): actualiser les notes de version\x1f\x1e\n` +
    `${"c".repeat(40)}\x1ffeat(ci): générer les notes\x1f\x1e\n` +
    `${"d".repeat(40)}\x1fchore(version): increment\x1f\x1e`;
  assert.deepEqual(parseCommits(log), [
    {
      sha: first,
      subject: "fix(front): clarifier les erreurs",
      body: "Un texte utile.",
    },
  ]);
  assert.equal(readerFriendlySubject("fix(front): clarifier les erreurs"), "clarifier les erreurs");
});

test("remplace la version courante tout en conservant l'historique", () => {
  const old = [
    { version: "0.9.1", status: "Beta", summary: "Ancien", changes: [] },
    { version: "0.9", status: "Beta", summary: "Précédent", changes: [] },
  ];
  const content = {
    summary: "Les erreurs sont plus claires.",
    changes: [{ title: "Messages", description: "Les erreurs indiquent quoi faire." }],
  };
  const result = updateNotes(old, "0.9.1", content);
  assert.deepEqual(result.map(({ version }) => version), ["0.9.1", "0.9"]);
  assert.equal(result[0].status, "Beta");
  assert.equal(result[0].summary, content.summary);
  assert.equal(old[0].summary, "Ancien");
  assert.throws(() => updateNotes(old, "0.9.1", { summary: "", changes: [] }));
});

test("demande un JSON au modèle local et valide sa réponse", async () => {
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, body: JSON.parse(options.body) };
    return {
      ok: true,
      json: async () => ({
        message: {
          content: JSON.stringify({
            summary: "Une navigation plus claire.",
            changes: [
              { title: "Navigation", description: "Les pages sont plus faciles à trouver." },
            ],
          }),
        },
      }),
    };
  };
  try {
    const result = await generateContent([{ subject: "fix: clarifier la navigation" }]);
    assert.equal(request.url, "http://127.0.0.1:11434/api/chat");
    assert.equal(request.body.model, "qwen2.5:1.5b-instruct");
    assert.equal(request.body.stream, false);
    assert.equal(request.body.format.required[0], "summary");
    assert.equal(result.changes[0].title, "Navigation");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("une correction de texte ne relance pas l'IA, mais un changement de version oui", () => {
  const files = ["front/src/config/release-notes.json"];
  assert.equal(isTextOnlyCorrection(files, "0.9.1", "0.9.1"), true);
  assert.equal(isTextOnlyCorrection(files, "0.9", "0.9.1"), false);
  assert.equal(
    isTextOnlyCorrection([...files, "front/src/App.tsx"], "0.9.1", "0.9.1"),
    false,
  );
});

test("raccourcit le texte du modèle pour conserver quatre cartes lisibles", () => {
  const result = validateContent({
    summary: `Une amélioration utile\n${"pour les apprenants ".repeat(20)}`,
    changes: Array.from({ length: 6 }, (_, index) => ({
      title: `Amélioration ${index} ${"très longue ".repeat(8)}`,
      description: `<b>Une correction</b> ${"plus claire ".repeat(20)}`,
    })),
  });
  assert.equal(result.changes.length, 4);
  assert.ok(result.summary.length <= 180);
  assert.ok(result.changes.every(({ title, description }) => title.length <= 50 && description.length <= 180));
  assert.ok(!/[<>\r\n]/.test(JSON.stringify(result)));
  assert.equal(
    validateContent({
      summary: "Une correction utile.",
      changes: [{ title: "fix(front): Navigation", description: "Un lien fonctionne." }],
    }).changes[0].title,
    "Navigation",
  );
});
