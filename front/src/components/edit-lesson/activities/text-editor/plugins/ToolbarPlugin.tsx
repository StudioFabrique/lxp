/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { INSERT_IMAGE_COMMAND } from "../nodes/ImageNode";

const LowPriority = 1;

interface ToolbarPluginProps {
  uploadImage?: (blobInfo: any, progress: any) => Promise<string>;
}

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin({ uploadImage }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files?.[0];

    if (file) {
      if (uploadImage) {
        try {
          // Créer un blobInfo compatible avec la fonction uploadImage
          const blobInfo = {
            blob: () => file,
            filename: () => file.name,
          };

          // Appeler la fonction uploadImage pour envoyer l'image au serveur
          const imageUrl = await uploadImage(blobInfo, null);

          // Insérer l'image avec l'URL retournée par le serveur
          if (imageUrl && imageUrl !== "error") {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              src: imageUrl,
              altText: file.name || "Image",
            });
          }
        } catch (error) {
          console.error("Erreur lors de l'upload de l'image:", error);
        }
      } else {
        // Fallback au comportement original si uploadImage n'est pas fourni
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === "string") {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              src: result,
              altText: file.name || "Image",
            });
          }
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = "";
  };

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <i className="format undo" />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <i className="format redo" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        <i className="format bold" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        <i className="format italic" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
        aria-label="Format Underline"
      >
        <i className="format underline" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
        aria-label="Format Strikethrough"
      >
        <i className="format strikethrough" />
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <i className="format left-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <i className="format center-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <i className="format right-align" />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <i className="format justify-align" />
      </button>
      <Divider />
      <button
        onClick={() => {
          fileInputRef.current?.click();
        }}
        className="toolbar-item"
        aria-label="Insert Image"
      >
        📷
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={insertImage}
        style={{ display: "none" }}
      />
    </div>
  );
}
