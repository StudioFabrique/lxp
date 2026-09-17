import { getLinkPreview, parseLinkPreview } from "../link-preview.ts";

it("lit le titre et le favicon du lien sans accepter un favicon externe", () => {
  const page = new URL("https://example.com/article");
  expect(
    parseLinkPreview(
      '<meta property="og:title" content="Un &amp; deux"><link rel="icon" href="/icon.svg">',
      page,
    ),
  ).toEqual({ title: "Un & deux", favicon: "https://example.com/icon.svg" });
  expect(
    parseLinkPreview(
      '<title>Article &amp; cours</title><link rel="icon" href="https://elsewhere.test/icon.ico">',
      page,
    ),
  ).toEqual({
    title: "Article & cours",
    favicon: "https://example.com/favicon.ico",
  });
});

it("refuse une adresse locale avant toute requête HTTP", async () => {
  await expect(getLinkPreview("http://127.0.0.1/private")).rejects.toThrow(
    "Lien inaccessible.",
  );
  await expect(getLinkPreview("http://[::1]/private")).rejects.toThrow(
    "Lien inaccessible.",
  );
});
