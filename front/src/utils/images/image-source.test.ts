import { describe, expect, it } from "vitest";
import { normalizeImageSource } from "./image-source";

describe("normalizeImageSource", () => {
  it.each(["blob:https://app.test/id", "https://app.test/avatar.png", "/avatar.png"])(
    "keeps displayable URLs unchanged: %s",
    (source) => expect(normalizeImageSource(source)).toBe(source),
  );

  it("keeps a data URL unchanged", () => {
    const source = "data:image/png;base64,iVBORw0KGgo=";
    expect(normalizeImageSource(source)).toBe(source);
  });

  it("turns legacy raw base64 into a data URL", () => {
    expect(normalizeImageSource("aGVsbG8=")).toBe(
      "data:image/jpeg;base64,aGVsbG8=",
    );
  });

  it("does not mistake JPEG base64 for a relative URL", () => {
    const jpeg = "/9j/4AAQSkZJRgABAQ==";
    expect(normalizeImageSource(jpeg)).toBe(
      `data:image/jpeg;base64,${jpeg}`,
    );
  });

  it("returns undefined for an empty source", () => {
    expect(normalizeImageSource("  ")).toBeUndefined();
  });
});
