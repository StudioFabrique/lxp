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
    };
  },
});
