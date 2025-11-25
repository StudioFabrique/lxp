import { Image } from "@tiptap/extension-image";

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: undefined,
      },
      height: {
        default: undefined,
      },
      "data-temp-id": {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-temp-id"),
        renderHTML: (attributes) => {
          if (!attributes["data-temp-id"]) return {};
          return { "data-temp-id": attributes["data-temp-id"] };
        },
      },
    };
  },
});
