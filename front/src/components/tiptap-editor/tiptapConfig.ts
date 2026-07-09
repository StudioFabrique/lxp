import { ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CharacterCount from "@tiptap/extension-character-count";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import { FontFamily } from "@tiptap/extension-font-family";
import Youtube from "@tiptap/extension-youtube";
import { TableKeyboardShortcuts } from "./extensions/TableKeyboardShortcuts";
import CodeBlockWithCopy from "./extensions/CodeBlockWithCopy/CodeBlockWithCopy";
import { ResizableImage } from "./extensions/ResizableImage";
import { all, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { Table } from "@tiptap/extension-table";
import { TextStyle } from "@tiptap/extension-text-style";

const lowlight = createLowlight(all);

const tiptapExtensions = [
  StarterKit.configure({ codeBlock: false }),
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
  Youtube,
  TableKeyboardShortcuts,
];

export { tiptapExtensions };
