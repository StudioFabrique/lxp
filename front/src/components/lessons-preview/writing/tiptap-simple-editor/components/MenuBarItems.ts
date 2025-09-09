import type { Editor } from "@tiptap/react";

export const items = (editor: Editor) => [
  {
    icon: "bold",
    title: "Gras",
    action: () => editor.chain().focus().toggleBold().run(),
    isActive: () => editor.isActive("bold"),
  },
  {
    icon: "italic",
    title: "Italique",
    action: () => editor.chain().focus().toggleItalic().run(),
    isActive: () => editor.isActive("italic"),
  },
  {
    icon: "strikethrough",
    title: "Barré",
    action: () => editor.chain().focus().toggleStrike().run(),
    isActive: () => editor.isActive("strike"),
  },
  // {
  //   icon: "code-view",
  //   title: "Code",
  //   action: () => editor.chain().focus().toggleCode().run(),
  //   isActive: () => editor.isActive("code"),
  // },
  // {
  //   icon: "mark-pen-line",
  //   title: "Highlight",
  //   action: () => editor.chain().focus().toggleHighlight().run(),
  //   isActive: () => editor.isActive("highlight"),
  // },
  {
    type: "divider",
  },
  {
    icon: "code-box-line",
    title: "Bloc de code",
    action: () => editor.chain().focus().toggleCodeBlock().run(),
    isActive: () => editor.isActive("codeBlock"),
  },
  // {
  //   icon: "double-quotes-l",
  //   title: "Blockquote",
  //   action: () => editor.chain().focus().toggleBlockquote().run(),
  //   isActive: () => editor.isActive("blockquote"),
  // },
  {
    icon: "separator",
    title: "Règle horizontale",
    action: () => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    type: "divider",
  },
  {
    icon: "text-wrap",
    title: "Saut de ligne",
    action: () => editor.chain().focus().setHardBreak().run(),
  },
  {
    icon: "format-clear",
    title: "Effacer le format",
    action: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
  },
  {
    type: "divider",
  },

  {
    icon: "bard-line",
    title: "Générer avec IA (disponible bientôt)",
    disabled: true,
    color: "info",
  },
  { type: "divider" },
  { type: "divider" },
  { type: "divider" },
  {
    icon: "arrow-go-back-line",
    title: "Annuler",
    action: () => editor.chain().focus().undo().run(),
  },
  {
    icon: "arrow-go-forward-line",
    title: "Rétablir",
    action: () => editor.chain().focus().redo().run(),
  },
  { type: "divider" },
];
