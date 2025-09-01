import "./MenuBar.scss";
import type { Editor } from "@tiptap/react";

import {
  Fragment,
  memo,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import MenuItem from "./MenuItem.jsx";
import { ContentTypePicker } from "./dropdowns/ContentTypePicker.js";
import { useMenuTextTypes } from "./hooks/useMenuTextTypes.js";
import { items } from "./MenuBarItems.js";
import { useMenuContentTypes } from "./hooks/useMenuContentTypes.js";
import { useMenuAlignTextTypes } from "./hooks/useMenuAlignTextTypes.js";
import { ColorPicker } from "./Colorpicker/Colorpicker.js";
import { useTextmenuStates } from "./hooks/useTextmenuStates.js";
import { useTextmenuCommands } from "./hooks/useTextmenuCommands.js";
import * as Popover from "@radix-ui/react-popover";
import { Toolbar } from "./ui/Toolbar.js";
import { Icon } from "./ui/Icon.js";
import { Surface } from "./ui/Surface.js";
import { FontFamilyPicker } from "./FontFamilyPicker.js";
import { EditLinkPopover } from "./EditLinkPopover.js";
import { EditYoutubeLinkPopover } from "./EditYoutubeLinkPopover.js";
import { InsertImagePopover } from "./InsertImagePopover.js";

type MenuBarProps = {
  editor: Editor;
  shouldHide?: boolean;
  onCloseEditor: () => void;
  onSave?: () => void;
};

const MemoButton = memo(Toolbar.Button);
const MemoContentTypePicker = memo(ContentTypePicker);
const MemoColorPicker = memo(ColorPicker);
const MemoFontFamilyPicker = memo(FontFamilyPicker);
// const MemoFontSizePicker = memo(FontSizePicker);

export default function MenuBar({
  editor,
  shouldHide = false,
  onCloseEditor,
  onSave,
}: MenuBarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const toolbarPositionRef = useRef<{ top: number; left: number } | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // Function to update toolbar position
  const updateToolbarPosition = useCallback(() => {
    if (toolbarRef.current) {
      const rect = toolbarRef.current.getBoundingClientRect();
      toolbarPositionRef.current = {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      };
    }
  }, []);

  // Initialize and update toolbar position when shouldHide changes
  useEffect(() => {
    if (toolbarRef.current && !shouldHide) {
      // Add a small delay to ensure layout transitions have completed
      const timer = setTimeout(() => {
        updateToolbarPosition();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [shouldHide, updateToolbarPosition]);

  // Set up scroll and resize event listeners
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      // Recalculate position on window resize
      updateToolbarPosition();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [updateToolbarPosition]);

  // Set up ResizeObserver to detect layout changes that affect toolbar position
  useEffect(() => {
    if (!toolbarRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      updateToolbarPosition();
    });

    resizeObserver.observe(toolbarRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateToolbarPosition]);

  // Calculate if toolbar should be fixed using useMemo
  const isToolbarFixed = useMemo(() => {
    if (!toolbarPositionRef.current) {
      // Fallback: try to calculate position immediately if not available
      if (toolbarRef.current) {
        updateToolbarPosition();
      }
      return false;
    }

    const originalTop = toolbarPositionRef.current.top;
    return scrollY > originalTop - 10;
  }, [scrollY, updateToolbarPosition]);

  const inputFileRef = useRef<HTMLInputElement>(null);
  const {
    menuContentOptions,
    isImageUploadPending,
    onSetImageSize,
    onImageUploadFromURL,
  } = useMenuContentTypes(editor, inputFileRef);

  const menuTextOptions = useMenuTextTypes(editor);

  const menuAlignTextOptions = useMenuAlignTextTypes(editor);
  const commands = useTextmenuCommands(editor);
  const states = useTextmenuStates(editor);

  return (
    <Toolbar.Wrapper
      ref={toolbarRef}
      hidden={shouldHide}
      className={`h-fit w-fit self-center ${
        isToolbarFixed ? "fixed top-2 z-50" : "relative"
      } flex justify-between px-2`}
    >
      <MemoContentTypePicker options={menuContentOptions} fixedIcon="Plus">
        <InsertImagePopover
          title="Image"
          onSetLink={onImageUploadFromURL}
          onClickButton={() => inputFileRef.current?.click()}
          onSetImageSize={onSetImageSize}
        />
        <EditLinkPopover title="Lien" onSetLink={commands.onLink} />
        <EditYoutubeLinkPopover
          title="Youtube"
          onSetLink={commands.onYoutubeLink}
        />
      </MemoContentTypePicker>
      <MemoContentTypePicker
        options={menuTextOptions}
        isLoading={isImageUploadPending}
      />
      <MemoContentTypePicker
        options={menuAlignTextOptions}
        fixedIcon="AlignLeft"
      />
      <MemoFontFamilyPicker
        onChange={commands.onSetFont}
        value={states.currentFont || ""}
      />
      {/* <MemoFontSizePicker
        onChange={commands.onSetFontSize}
        value={states.currentSize || ""}
      /> */}

      {/* Color Picker for Text Color */}
      <Popover.Root>
        <Popover.Trigger asChild>
          <MemoButton active={!!states.currentColor} tooltip="Couleur du texte">
            <Icon name="Palette" />
          </MemoButton>
        </Popover.Trigger>
        <Popover.Content side="top" sideOffset={8} asChild>
          <Surface className="p-1">
            <MemoColorPicker
              color={states.currentColor}
              onChange={commands.onChangeColor}
              onClear={commands.onClearColor}
            />
          </Surface>
        </Popover.Content>
      </Popover.Root>

      {/* Color Picker for Highlight Color */}
      <Popover.Root>
        <Popover.Trigger asChild>
          <MemoButton
            active={!!states.currentHighlight}
            tooltip="Surbrillance du texte"
          >
            <Icon name="Highlighter" />
          </MemoButton>
        </Popover.Trigger>
        <Popover.Content side="top" sideOffset={8} asChild>
          <Surface className="p-1">
            <MemoColorPicker
              color={states.currentHighlight}
              onChange={commands.onChangeHighlight}
              onClear={commands.onClearHighlight}
            />
          </Surface>
        </Popover.Content>
      </Popover.Root>

      {items(editor).map((item) => (
        <Fragment key={item.title || `divider-${Math.random()}`}>
          {item.type === "divider" ? (
            <span className="divider" />
          ) : (
            <MenuItem {...item} />
          )}
        </Fragment>
      ))}

      {onSave ? (
        <MenuItem
          icon="save-line"
          title="Enregistrer"
          action={onSave}
          disabled={!editor.getText().trim()}
        />
      ) : null}

      <MenuItem
        icon="close-large-line"
        title="Fermer l'éditeur"
        action={onCloseEditor}
      />

      <input
        ref={inputFileRef}
        className="hidden"
        type="file"
        accept="image/*"
      />
    </Toolbar.Wrapper>
  );
}
