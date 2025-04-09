import { Editor, useEditorState } from "@tiptap/react";
import { ContentPickerOptions } from "../dropdowns/ContentTypePicker";

export const useMenuTextTypes = (editor: Editor) => {
  return useEditorState({
    editor,
    selector: (ctx): ContentPickerOptions => [
      {
        type: "category",
        label: "Hiérarchie",
        id: "hierarchy",
      },
      {
        icon: "Pilcrow",
        onClick: () =>
          ctx.editor
            .chain()
            .focus()
            .lift("taskItem")
            .liftListItem("listItem")
            .setParagraph()
            .run(),
        id: "paragraph",
        disabled: () => !ctx.editor.can().setParagraph(),
        isActive: () =>
          ctx.editor.isActive("paragraph") &&
          !ctx.editor.isActive("orderedList") &&
          !ctx.editor.isActive("bulletList") &&
          !ctx.editor.isActive("taskList"),
        label: "Paragraphe",
        type: "option",
      },
      {
        icon: "Heading1",
        onClick: () =>
          ctx.editor
            .chain()
            .focus()
            .lift("taskItem")
            .liftListItem("listItem")
            .setHeading({ level: 1 })
            .run(),
        id: "heading1",
        disabled: () => !ctx.editor.can().setHeading({ level: 1 }),
        isActive: () => ctx.editor.isActive("heading", { level: 1 }),
        label: "Titre 1",
        type: "option",
      },
      {
        icon: "Heading2",
        onClick: () =>
          ctx.editor
            .chain()
            .focus()
            .lift("taskItem")
            .liftListItem("listItem")
            .setHeading({ level: 2 })
            .run(),
        id: "heading2",
        disabled: () => !ctx.editor.can().setHeading({ level: 2 }),
        isActive: () => ctx.editor.isActive("heading", { level: 2 }),
        label: "Titre 2",
        type: "option",
      },
      {
        icon: "Heading3",
        onClick: () =>
          ctx.editor
            .chain()
            .focus()
            .lift("taskItem")
            .liftListItem("listItem")
            .setHeading({ level: 3 })
            .run(),
        id: "heading3",
        disabled: () => !ctx.editor.can().setHeading({ level: 3 }),
        isActive: () => ctx.editor.isActive("heading", { level: 3 }),
        label: "Titre 3",
        type: "option",
      },
      {
        type: "category",
        label: "Listes",
        id: "lists",
      },
      {
        icon: "List",
        onClick: () => ctx.editor.chain().focus().toggleBulletList().run(),
        id: "bulletList",
        disabled: () => !ctx.editor.can().toggleBulletList(),
        isActive: () => ctx.editor.isActive("bulletList"),
        label: "Liste à puces",
        type: "option",
      },
      {
        icon: "ListOrdered",
        onClick: () => ctx.editor.chain().focus().toggleOrderedList().run(),
        id: "orderedList",
        disabled: () => !ctx.editor.can().toggleOrderedList(),
        isActive: () => ctx.editor.isActive("orderedList"),
        label: "Liste numérotée",
        type: "option",
      },
      {
        icon: "ListTodo",
        onClick: () => ctx.editor.chain().focus().toggleTaskList().run(),
        id: "todoList",
        disabled: () => !ctx.editor.can().toggleTaskList(),
        isActive: () => ctx.editor.isActive("taskList"),
        label: "Liste de tâches",
        type: "option",
      },
    ],
  });
};
