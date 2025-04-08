import { Editor, FloatingMenu } from "@tiptap/react";
import { Camera, Code, Table } from "lucide-react";
import { Toolbar } from "../../ui/Toolbar";
import { memo } from "react";

const MemoButton = memo(Toolbar.Button);

export type TextMenuProps = {
  editor: Editor;
};

export const SlashContentMenu = ({ editor }: TextMenuProps) => {
  return (
    <FloatingMenu
      tippyOptions={{
        popperOptions: {
          placement: "top-start",
          modifiers: [
            {
              name: "preventOverflow",
              options: {
                boundary: "viewport",
                padding: 8,
              },
            },
            {
              name: "flip",
              options: {
                fallbackPlacements: ["bottom-start", "top-end", "bottom-end"],
              },
            },
          ],
        },
        offset: [0, 8],
        maxWidth: "calc(100vw - 16px)",
      }}
      editor={editor}
      shouldShow={() => editor.getText().endsWith("/")}
      className="w-max flex gap-5 items-center ml-20"
    >
      <Toolbar.Wrapper>
        <MemoButton className="btn btn-sm" tooltip="Insérer une photo">
          <Camera />
        </MemoButton>
        <Toolbar.Divider />
        <MemoButton className="btn btn-sm" tooltip="Insérer une photo">
          <Camera />
        </MemoButton>
        <MemoButton className="btn btn-sm" tooltip="Insérer du code">
          <Code />
        </MemoButton>
        <MemoButton className="btn btn-sm" tooltip="Insérer un tableau">
          <Table />
        </MemoButton>
      </Toolbar.Wrapper>
    </FloatingMenu>
  );
};
