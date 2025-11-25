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
      dataTempId: {
        default: undefined,
        parseHTML: (element) => element.getAttribute("data-temp-id"),
        renderHTML: (attributes) => {
          if (!attributes.dataTempId) return {};
          return { "data-temp-id": attributes.dataTempId };
        },
      },
    };
  },
});
