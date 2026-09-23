import assert from "node:assert/strict";
import { test } from "node:test";
import {
  generateContent,
  iconForChange,
  isManualNoteUpdate,
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
    `${"d".repeat(40)}\x1fchore(version): increment\x1f\x1e\n` +
    `${"e".repeat(40)}\x1ffeat(ui): compléter les notes de version\x1f\x1e\n` +
    `${"f".repeat(40)}\x1fstyle(ui): harmoniser le halo de la carte version\x1f\x1e\n` +
    `${"1".repeat(40)}\x1ffeat(ui): compléter les notes et adapter leurs icônes\x1f\x1e`;
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
  const result = updateNotes(old, "0.9.1", content, "release/0.9.1");
  assert.deepEqual(result.map(({ version }) => version), ["0.9.1", "0.9"]);
  assert.equal(result[0].status, "Beta");
  assert.equal(result[0].branch, "release/0.9.1");
  assert.equal(result[0].summary, content.summary);
  assert.equal(old[0].summary, "Ancien");
  assert.throws(() => updateNotes(old, "0.9.1", { summary: "", changes: [] }));
});

test("ne conserve que les cinq dernières versions", () => {
  const old = Array.from({ length: 6 }, (_, index) => ({
    version: `0.9.${6 - index}`,
    status: "Beta",
  }));
  const result = updateNotes(old, "0.9.7", {
    summary: "Une correction utile.",
    changes: [{ title: "Navigation", description: "Un lien fonctionne." }],
  }, "release/0.9.7");
  assert.equal(result.length, 5);
  assert.deepEqual(result.map(({ version }) => version), ["0.9.7", "0.9.6", "0.9.5", "0.9.4", "0.9.3"]);
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
    assert.equal(request.body.model, "qwen2.5:3b-instruct");
    assert.equal(request.body.stream, false);
    assert.equal(request.body.format.required[0], "summary");
    assert.equal(result.changes[0].title, "Navigation");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("une correction de texte ne relance pas l'IA, mais un changement de version oui", () => {
  const files = ["front/src/config/release-notes.json"];
  assert.equal(isManualNoteUpdate(files, "0.9.1", "0.9.1"), true);
  assert.equal(isManualNoteUpdate(files, "0.9", "0.9.1"), false);
  assert.equal(
    isManualNoteUpdate([...files, "front/src/App.tsx"], "0.9.1", "0.9.1"),
    true,
  );
});

test("choisit une icône liée au sujet de la carte", () => {
  assert.equal(iconForChange("Comptes sécurisés"), "shield");
  assert.equal(iconForChange("Rôles corrigés"), "users");
  assert.equal(iconForChange("Calendrier cohérent"), "calendar");
  assert.equal(iconForChange("Profil réorganisé"), "user");
  assert.equal(iconForChange("Écran d’initialisation"), "monitor");
  assert.equal(validateContent({
    summary: "Une correction utile.",
    changes: [{ title: "Calendrier", description: "Plus lisible." }],
  }).changes[0].icon, "calendar");
});

test("refuse les textes coupés au lieu de les publier", () => {
  assert.throws(() => validateContent({
    summary: "Une correction utile.",
    changes: [{ title: "Amélioration de", description: "Le parcours est plus clair…" }],
  }));
  assert.throws(() => validateContent({
    summary: `Une amélioration utile ${"pour les apprenants ".repeat(20)}`,
    changes: [{ title: "Parcours", description: "Le parcours est plus clair." }],
  }));
  assert.throws(() => validateContent({
    summary: "Des notes de version plus claires.",
    changes: [{ title: "Nouveautés", description: "Les notes sont plus claires." }],
  }));
  assert.equal(
    validateContent({
      summary: "Une correction utile.",
      changes: [{ title: "fix(front): Navigation", description: "Un lien fonctionne." }],
    }).changes[0].title,
    "Navigation",
  );
});

test("demande une reformulation quand la première réponse est coupée", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ message: { content: JSON.stringify(++calls === 1
      ? { summary: "Une correction utile.", changes: [{ title: "Amélioration de", description: "Texte coupé…" }] }
      : { summary: "Une correction utile.", changes: [{ title: "Parcours", description: "Le parcours est plus clair." }] }) } }),
  });
  try {
    assert.equal((await generateContent([{ subject: "fix: clarifier le parcours" }])).changes[0].title, "Parcours");
    assert.equal(calls, 2);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
