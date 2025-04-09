import { Editor, useEditorState } from "@tiptap/react";
import { ContentPickerOptions } from "../dropdowns/ContentTypePicker";

export const useMenuContentTypes = (editor: Editor) => {
  return useEditorState({
    editor,
    selector: (ctx): ContentPickerOptions => [
      {
        type: "category",
        label: "Insertion",
        id: "insert",
      },
      {
        icon: "PictureInPicture",
        onClick: () => {},
        id: "picture",
        disabled: () => !ctx.editor.can().toggleBulletList(),
        isActive: () => ctx.editor.isActive("picture"),
        label: "Image",
        type: "option",
      },
      {
        icon: "Table",
        onClick: () => {},
        id: "table",
        disabled: () => false,
        isActive: () => false,
        label: "Tableau",
        type: "option",
      },
    ],
  });
};
