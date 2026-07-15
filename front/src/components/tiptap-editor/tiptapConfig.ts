import { ReactNodeViewRenderer } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CharacterCount } from "@tiptap/extensions";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import TextAlign from "@tiptap/extension-text-align";
import { FontFamily, TextStyle } from "@tiptap/extension-text-style";
import Youtube from "@tiptap/extension-youtube";
import { TableKeyboardShortcuts } from "./extensions/TableKeyboardShortcuts";
import CodeBlockWithCopy from "./extensions/CodeBlockWithCopy/CodeBlockWithCopy";
import { ResizableImage } from "./extensions/ResizableImage";
import { all, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table";

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
