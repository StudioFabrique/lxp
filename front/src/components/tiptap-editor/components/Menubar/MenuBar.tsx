import type { Editor } from "@tiptap/react";

import { memo, useEffect, useRef } from "react";

import MenuItem from "./MenuItem.js";
import { ContentTypePicker } from "../dropdowns/ContentTypePicker.js";
import { useMenuTextTypes } from "../hooks/useMenuTextTypes.js";
import { useMenuContentTypes } from "../hooks/useMenuContentTypes.js";
import { useMenuAlignTextTypes } from "../hooks/useMenuAlignTextTypes.js";
import { useTextmenuStates } from "../hooks/useTextmenuStates.js";
import { useTextmenuCommands } from "../hooks/useTextmenuCommands.js";
import { Toolbar } from "../ui/Toolbar.js";
import { FontFamilyPicker } from "../FontFamilyPicker.js";
import { EditLinkPopover } from "../EditLinkPopover.js";
import { EditYoutubeLinkPopover } from "../EditYoutubeLinkPopover.js";
import { InsertImagePopover } from "../InsertImagePopover.js";
import { TableInsertPopover } from "../TableInsertPopover.js";
import { items } from "./MenuBarItems.js";

type MenuBarProps = {
  editor: Editor;
  shouldHide?: boolean;
  isSticky?: boolean;
  onUploadAllImagesRef?: React.MutableRefObject<(() => Promise<void>) | null>;
};

const MemoContentTypePicker = memo(ContentTypePicker);
const MemoFontFamilyPicker = memo(FontFamilyPicker);

export default function MenuBar({
  editor,
  shouldHide = false,
  isSticky = false,
  onUploadAllImagesRef,
}: MenuBarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const {
    menuContentOptions,
    onSetImageSize,
    onImageUploadFromURL,
    uploadAllImages,
  } = useMenuContentTypes(editor, inputFileRef);

  const menuTextOptions = useMenuTextTypes(editor);

  const menuAlignTextOptions = useMenuAlignTextTypes(editor);
  const commands = useTextmenuCommands(editor);
  const states = useTextmenuStates(editor);

  useEffect(() => {
    if (onUploadAllImagesRef) {
      onUploadAllImagesRef.current = uploadAllImages;
    }
  }, [uploadAllImages, onUploadAllImagesRef]);

  return (
    <Toolbar.Wrapper
      ref={toolbarRef}
      hidden={shouldHide}
      className={`self-center min-h-14 max-h-max justify-between px-2 transition-all duration-300 ease-in-out flex-wrap min-w-max ${
        isSticky
          ? "fixed top-4 transform shadow-xl shadow-base-content/10 rounded-2xl border border-base-300 h-fit bg-base-100/95 backdrop-blur-md"
          : "border-b border-base-300"
      }`}
    >
      <MemoContentTypePicker options={menuContentOptions} fixedIcon="Plus">
        <InsertImagePopover
          title="Image"
          onSetLink={onImageUploadFromURL}
          onClickUpload={() => inputFileRef.current?.click()}
          onSetImageSize={onSetImageSize}
        />
        <EditLinkPopover title="Lien" onSetLink={commands.onLink} />
        <EditYoutubeLinkPopover
          title="Youtube"
          onSetLink={commands.onYoutubeLink}
        />
        <TableInsertPopover editor={editor} title="Tableau" />
      </MemoContentTypePicker>

      <MemoContentTypePicker options={menuTextOptions} />
      <MemoContentTypePicker
        options={menuAlignTextOptions}
        fixedIcon="TextAlignCenter"
      />
      <MemoFontFamilyPicker
        onChange={commands.onSetFont}
        value={states.currentFont || ""}
      />

      {items(editor).map((item) => (
        <MenuItem key={item.title} {...item} />
      ))}

      <input
        ref={inputFileRef}
        onClick={(event) => {
          event.currentTarget.value = "";
        }}
        className="hidden"
        type="file"
        accept="image/*"
      />
    </Toolbar.Wrapper>
  );
}
