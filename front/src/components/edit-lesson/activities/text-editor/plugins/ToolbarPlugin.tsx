/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  $createParagraphNode,
} from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { INSERT_IMAGE_COMMAND } from "../nodes/ImageNode";

const LowPriority = 1;

const blockTypeToBlockName = {
  paragraph: "Normal",
  h1: "Titre 1",
  h2: "Titre 2",
  h3: "Titre 3",
  h4: "Titre 4",
  h5: "Titre 5",
  h6: "Titre 6",
  quote: "Citation",
};

function Divider() {
  return <div className="divider" />;
}

interface ToolbarPluginProps {
  uploadImage?: (blobInfo: any, progress: any) => Promise<string>;
}

const ToolbarPlugin = ({ uploadImage }: ToolbarPluginProps) => {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const onBlockTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBlockType = e.target.value;
    if (newBlockType === "paragraph") {
      formatParagraph();
    } else {
      formatHeading(newBlockType as HeadingTagType);
    }
    setBlockType(newBlockType);
  };

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
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      // Update block type
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElement();
      const elementKey = element?.getKey();

      if (elementKey !== null) {
        const elementDOM = editor.getElementByKey(elementKey!);
        if (elementDOM !== null) {
          const type = elementDOM?.nodeName.toLowerCase();
          setBlockType(type);
        }
      }
    }
  }, [editor]);

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
    <div
      className="toolbar flex mb-1 bg-white p-1 rounded-t-lg"
      ref={toolbarRef}
    >
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
      <select
        className="toolbar-item block-style"
        onChange={onBlockTypeChange}
        value={blockType}
      >
        <option value="paragraph">{blockTypeToBlockName.paragraph}</option>
        <option value="h1">{blockTypeToBlockName.h1}</option>
        <option value="h2">{blockTypeToBlockName.h2}</option>
        <option value="h3">{blockTypeToBlockName.h3}</option>
        <option value="h4">{blockTypeToBlockName.h4}</option>
        <option value="h5">{blockTypeToBlockName.h5}</option>
        <option value="h6">{blockTypeToBlockName.h6}</option>
        <option value="quote">{blockTypeToBlockName.quote}</option>
      </select>
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
};

export default ToolbarPlugin;
