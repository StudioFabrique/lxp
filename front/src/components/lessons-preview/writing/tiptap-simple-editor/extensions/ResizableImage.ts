import { Image } from "@tiptap/extension-image";

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      size: {
        default: "small",
        parseHTML: (element) => element.getAttribute("data-size") || "medium",
        renderHTML: (attributes) => {
          return {
            "data-size": attributes.size,
            class: `image-${attributes.size}`,
          };
        },
      },
    };
  },
});
