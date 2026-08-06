import { imageToDataUrl } from "../../src/utils/images/image-source.ts";

describe("imageToDataUrl", () => {
  it("does not prefix an already displayable source", () => {
    const source = "data:image/webp;base64,UklGRg==";
    expect(imageToDataUrl(source)).toBe(source);
  });

  it("serializes raw base64 with the default legacy MIME type", () => {
    expect(imageToDataUrl("aGVsbG8=")).toBe(
      "data:image/jpeg;base64,aGVsbG8="
    );
  });

  it("does not mistake JPEG base64 for a relative URL", () => {
    const jpeg = "/9j/4AAQSkZJRgABAQ==";
    expect(imageToDataUrl(jpeg)).toBe(`data:image/jpeg;base64,${jpeg}`);
  });

  it("detects PNG buffers", () => {
    const png = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    expect(imageToDataUrl(png)).toBe("data:image/png;base64,iVBORw0KGgo=");
  });

  it("returns null when no image is provided", () => {
    expect(imageToDataUrl(undefined)).toBeNull();
  });
});
