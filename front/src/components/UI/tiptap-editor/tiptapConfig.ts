import { ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import { FontFamily } from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import { TableKeyboardShortcuts } from "./extensions/TableKeyboardShortcuts";
import CodeBlockWithCopy from "./extensions/CodeBlockWithCopy/CodeBlockWithCopy";
import { ResizableImage } from "./extensions/ResizableImage";
import { all, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import HardBreak from "@tiptap/extension-hard-break";

const lowlight = createLowlight(all);

const tiptapExtensions = [
  StarterKit.configure({ codeBlock: false, hardBreak: false }),
  HardBreak.extend({
    addKeyboardShortcuts() {
      return {
        Enter: () => this.editor.commands.setHardBreak(),
      };
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TaskList,
  TaskItem,
  CharacterCount.configure({
    limit: 10000,
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "tiptap-table",
    },
    allowTableNodeSelection: true,
  }),
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlockWithCopy);
    },
  }).configure({ lowlight }),
  TableRow,
  TableHeader,
  TableCell,
  ResizableImage,
  TextStyle,
  FontFamily,
  Link,
  Youtube,
  TableKeyboardShortcuts,
];

export { tiptapExtensions };
