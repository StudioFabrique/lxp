import assert from "node:assert/strict";
import { test } from "node:test";
import {
  generateContent,
  parseCommits,
  updateNotes,
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
    `${generated}\x1fchore(release): actualiser les notes de version\x1f\x1e`;
  assert.deepEqual(parseCommits(log), [
    {
      sha: first,
      subject: "fix(front): clarifier les erreurs",
      body: "Un texte utile.",
    },
  ]);
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
