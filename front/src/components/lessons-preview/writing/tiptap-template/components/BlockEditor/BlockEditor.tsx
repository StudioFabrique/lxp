// import { Sidebar } from "../Sidebar";
// import { ContentItemMenu } from "../menus/ContentItemMenu";
import { EditorContent } from "@tiptap/react";
import { useRef } from "react";
import { useBlockEditor } from "../../hooks/useBlockEditor";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { useSidebar } from "../../hooks/useSidebar";
import { LinkMenu } from "../menus/LinkMenu";

export const BlockEditor = () => {
  const menuContainerRef = useRef(null);
  const leftSidebar = useSidebar();
  const { editor } = useBlockEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      {/* Paid pro extension - TableOfContents */}
      {/* <Sidebar
        isOpen={leftSidebar.isOpen}
        onClose={leftSidebar.close}
        editor={editor}
      /> */}
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorHeader
          editor={editor}
          isSidebarOpen={leftSidebar.isOpen}
          toggleSidebar={leftSidebar.toggle}
        />
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        {/* <ContentItemMenu editor={editor} isEditable={true} /> */}
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
      </div>
    </div>
  );
};
