import { createRoot } from "react-dom/client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import { ResizableImage } from "./src/components/tiptap-editor/extensions/ResizableImage";
import MenuBar from "./src/components/tiptap-editor/components/Menubar/MenuBar";
import "./src/index.css";
function Preview() {
  const editor = useEditor({ extensions: [StarterKit, ResizableImage, Table, TableRow, TableCell, TableHeader], content: "<p>Contenu de l'activité</p>" });
  return <div className="m-3 rounded-xl border border-base-300 bg-base-200 p-4"><h1 className="mb-4 text-xl font-semibold">Éditeur d'activité</h1>{editor && <><MenuBar editor={editor} /><EditorContent editor={editor} /></>}</div>;
}
createRoot(document.getElementById("root")!).render(<Preview />);
