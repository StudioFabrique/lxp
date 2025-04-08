import { EditorContent } from "@tiptap/react";
import { useRef } from "react";
import { useBlockEditor } from "../../hooks/useBlockEditor";
import { EditorHeader } from "./components/EditorHeader";
import { TextMenu } from "../menus/TextMenu";
import { NewLineMenu } from "../menus/NewLineMenu/NewLineMenu";
import { LinkMenu } from "../menus/LinkMenu";
// import { Sidebar } from "../Sidebar";
// import { ContentItemMenu } from "../menus/ContentItemMenu";
// import { useSidebar } from "../../hooks/useSidebar";
// import { ContentItemMenu } from "../menus";

type BlockEditorProps = {
  onCloseEditor: () => void;
};

export const BlockEditor = ({ onCloseEditor }: BlockEditorProps) => {
  const menuContainerRef = useRef(null);
  // const leftSidebar = useSidebar();
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
          onCloseEditor={onCloseEditor}
          // isSidebarOpen={leftSidebar.isOpen}
          // toggleSidebar={leftSidebar.toggle}
        />
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        {/* <ContentItemMenu editor={editor} isEditable={true} /> */}
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <NewLineMenu editor={editor} />
        <TextMenu editor={editor} />
      </div>
    </div>
  );
};
