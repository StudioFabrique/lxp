import { Editor, useEditorState } from "@tiptap/react";
import { ContentPickerOptions } from "../dropdowns/ContentTypePicker";

export const useMenuAlignTextTypes = (editor: Editor) => {
  return useEditorState({
    editor,
    selector: (ctx): ContentPickerOptions => [
      {
        type: "category",
        label: "Position du texte",
        id: "text alignement",
      },
      {
        icon: "AlignLeft",
        onClick: () => ctx.editor.chain().focus().setTextAlign("left").run(),
        id: "align-left",
        disabled: () => !ctx.editor.can().setTextAlign("left"),
        isActive: () => ctx.editor.isActive({ textAlign: "left" }),
        label: "Aligner à gauche",
        type: "option",
      },
      {
        icon: "AlignCenter",
        onClick: () => ctx.editor.chain().focus().setTextAlign("center").run(),
        id: "align-center",
        disabled: () => !ctx.editor.can().setTextAlign("center"),
        isActive: () => ctx.editor.isActive({ textAlign: "center" }),
        label: "Centrer",
        type: "option",
      },
      {
        icon: "AlignRight",
        onClick: () => ctx.editor.chain().focus().setTextAlign("right").run(),
        id: "align-right",
        disabled: () => !ctx.editor.can().setTextAlign("right"),
        isActive: () => ctx.editor.isActive({ textAlign: "right" }),
        label: "Aligner à droite",
        type: "option",
      },
      {
        icon: "AlignJustify",
        onClick: () => ctx.editor.chain().focus().setTextAlign("justify").run(),
        id: "align-justify",
        disabled: () => !ctx.editor.can().setTextAlign("justify"),
        isActive: () => ctx.editor.isActive({ textAlign: "justify" }),
        label: "Justifier",
        type: "option",
      },
    ],
  });
};
