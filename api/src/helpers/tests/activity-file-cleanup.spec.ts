import {
  extractLocalImagesFromHtml,
  resolveActivityFilePath,
} from "../activity-file-cleanup.ts";

describe("activity file cleanup", () => {
  it("résout chaque fichier dans le dossier correspondant à son type", () => {
    expect(
      resolveActivityFilePath({ url: "support.md", type: "resource" }),
    ).toMatch(/uploads\/activities\/files\/support\.md$/);
    expect(
      resolveActivityFilePath({ url: "contenu.html", type: "text" }),
    ).toMatch(/uploads\/activities\/contenu\.html$/);
    expect(
      resolveActivityFilePath({ url: "illustration.png", type: "image" }),
    ).toMatch(/uploads\/activities\/images\/illustration\.png$/);
    expect(
      resolveActivityFilePath({ url: "cours.mp4", type: "video" }),
    ).toMatch(/uploads\/activities\/videos\/cours\.mp4$/);
  });

  it("ignore les URL externes", () => {
    expect(
      resolveActivityFilePath({
        url: "https://example.com/video.mp4",
        type: "video",
      }),
    ).toBeNull();
  });

  it("extrait uniquement les images locales d'un contenu texte", () => {
    const references = extractLocalImagesFromHtml(`
      <img src="http://localhost:3000/activities/images/image-a.png?size=large">
      <img src='activities/images/image-b.webp'>
      <img src="https://example.com/external.png">
    `);

    expect(references).toEqual([
      {
        url: "image-a.png",
        type: "image",
        trackedInMediatheque: true,
      },
      {
        url: "image-b.webp",
        type: "image",
        trackedInMediatheque: true,
      },
    ]);
  });
});
