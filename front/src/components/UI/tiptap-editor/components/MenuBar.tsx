import "./MenuBar.scss";
import type { Editor } from "@tiptap/react";

import { memo, useEffect, useRef } from "react";

import MenuItem from "./MenuItem.js";
import { ContentTypePicker } from "./dropdowns/ContentTypePicker.js";
import { useMenuTextTypes } from "./hooks/useMenuTextTypes.js";
import { items } from "./MenuBarItems.js";
import { useMenuContentTypes } from "./hooks/useMenuContentTypes.js";
import { useMenuAlignTextTypes } from "./hooks/useMenuAlignTextTypes.js";
// import { ColorPicker } from "./Colorpicker/Colorpicker.js";
import { useTextmenuStates } from "./hooks/useTextmenuStates.js";
import { useTextmenuCommands } from "./hooks/useTextmenuCommands.js";
import { Toolbar } from "./ui/Toolbar.js";
import { FontFamilyPicker } from "./FontFamilyPicker.js";
import { EditLinkPopover } from "./EditLinkPopover.js";
import { EditYoutubeLinkPopover } from "./EditYoutubeLinkPopover.js";
import { InsertImagePopover } from "./InsertImagePopover.js";
import { TableInsertPopover } from "./TableInsertPopover.js";

type MenuBarProps = {
  editor: Editor;
  shouldHide?: boolean;
  isSticky?: boolean;
  onUploadAllImagesRef?: React.MutableRefObject<(() => Promise<void>) | null>;
};

// const MemoButton = memo(Toolbar.Button);
const MemoContentTypePicker = memo(ContentTypePicker);
// const MemoColorPicker = memo(ColorPicker);
const MemoFontFamilyPicker = memo(FontFamilyPicker);
// const MemoFontSizePicker = memo(FontSizePicker);

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
    isImageUploadPending,
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
      className={`self-center min-h-14 max-h-max justify-between px-2 transition-all duration-300 ease-in-out border-none shadow-none rounded-none flex-wrap ${
        isSticky
          ? "fixed top-4 transform shadow-lg rounded-lg border h-fit"
          : ""
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

      <MemoContentTypePicker
        options={menuTextOptions}
        isLoading={isImageUploadPending}
      />
      <MemoContentTypePicker
        options={menuAlignTextOptions}
        fixedIcon="TextAlignCenter"
      />
      <MemoFontFamilyPicker
        onChange={commands.onSetFont}
        value={states.currentFont || ""}
      />

      {/* Color Picker for Text Color */}
      {/* <Popover.Root>
        <Popover.Trigger asChild>
          <MemoButton active={!!states.currentColor} tooltip="Couleur du texte">
            <Icon name="Palette" className="text-base-content" />
          </MemoButton>
        </Popover.Trigger>
        <Popover.Content side="top" sideOffset={8} asChild>
          <Surface className="p-4 mt-3">
            <MemoColorPicker
              color={states.currentColor}
              onChange={commands.onChangeColor}
              onClear={commands.onClearColor}
            />
          </Surface>
        </Popover.Content>
      </Popover.Root> */}

      {/* Color Picker for Highlight Color */}
      {/* <Popover.Root>
        <Popover.Trigger asChild>
          <MemoButton
            active={!!states.currentHighlight}
            tooltip="Surbrillance du texte"
          >
            <Icon name="Highlighter" className="text-base-content" />
          </MemoButton>
        </Popover.Trigger>
        <Popover.Content side="top" sideOffset={8} asChild>
          <Surface className="p-4 mt-3">
            <MemoColorPicker
              color={states.currentHighlight}
              onChange={commands.onChangeHighlight}
              onClear={commands.onClearHighlight}
            />
          </Surface>
        </Popover.Content>
      </Popover.Root> */}

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
