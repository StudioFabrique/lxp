import { Image } from "@tiptap/extension-image";
import { ACTIVITIES } from "../../../config/urls";

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      src: {
        default: null,
        // Les archives gardent des chemins portables. À l’affichage, les
        // images doivent utiliser l’API même si le front a une autre origine.
        renderHTML: ({ src }) => ({
          src:
            typeof src === "string" && /^\/?activities\/images\//.test(src)
              ? `${ACTIVITIES}${src.replace(/^\/?activities\//, "")}`
              : src,
        }),
      },
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
