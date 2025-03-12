/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
  type TextMatchTransformer,
} from "@lexical/markdown";
import {
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
  $getRoot,
} from "lexical";
import { useCallback, useEffect, useState } from "react";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ImagePlugin from "./plugins/ImagePlugin";
import {
  ImageNode,
  $createImageNode,
  INSERT_IMAGE_COMMAND,
} from "./nodes/ImageNode";
import { parseAllowedColor, parseAllowedFontSize } from "./styleConfig";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import "./styles.css";
import useHttp from "../../../../hooks/use-http";

const placeholder = "Enter some rich text...";

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
    ]) {
      el.removeAttribute("class");
      el.removeAttribute("style");
      if (el.getAttribute("dir") === "ltr") {
        el.removeAttribute("dir");
      }
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

const editorConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: "React.js Demo",
  theme: ExampleTheme,
  nodes: [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    CodeNode,
    ParagraphNode,
    TextNode,
    ImageNode,
  ],
  onError: (error: Error) => {
    throw error;
  },
};

const IMAGE_TRANSFORMERS: TextMatchTransformer[] = [
  {
    dependencies: [ImageNode],
    export: (node: LexicalNode) => {
      if (node instanceof ImageNode) {
        const altText = node.__altText || "";
        const src = node.__src || "";
        console.log("Exporting image node:", { altText, src });
        if (!src) return null;
        return `![${altText}](${src})`;
      }
      return null;
    },
    regExp: /!\[(.*?)\]\((.*?)\)/,
    replace: (textNode: TextNode, match: RegExpMatchArray) => {
      const [, altText, src] = match;
      console.log("Creating image node:", { altText, src });
      if (!src) return;
      const node = $createImageNode({
        altText: altText || "",
        src,
      });
      textNode.replace(node);
    },
    type: "text-match" as const,
  },
];

const MARKDOWN_TRANSFORMERS = [...IMAGE_TRANSFORMERS, ...TRANSFORMERS];

type EditorContentManagerProps = {
  content: string;
  onCancel: () => void;
  onSubmit: (value: string) => void;
};

function EditorContentManager({
  content,
  onCancel,
  onSubmit,
}: EditorContentManagerProps) {
  const [editor] = useLexicalComposerContext();
  const [markdown, setMarkdown] = useState(content ?? "");

  const hasContent: boolean = markdown.length > 0;

  const loadMarkdownFile = async (file: File) => {
    try {
      const content = await file.text();
      console.log("Contenu du fichier markdown:", content);

      // Extraire les images du contenu markdown
      const imageMatches = [...content.matchAll(/!\[(.*?)\]\((.*?)\)/g)];
      const images = imageMatches.map((match) => ({
        alt: match[1] || "",
        src: match[2],
      }));

      // Charger d'abord le contenu sans les images
      let processedContent = content;
      for (const img of imageMatches) {
        processedContent = processedContent.replace(img[0], "");
      }

      editor.update(() => {
        const root = $getRoot();
        root.clear();

        // Convertir le markdown en nœuds Lexical
        $convertFromMarkdownString(processedContent, MARKDOWN_TRANSFORMERS);

        // Ajouter les images manuellement
        for (const img of images) {
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            src: img.src,
            altText: img.alt,
          });
        }
      });
    } catch (error) {
      console.error("Error loading markdown file:", error);
    }
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        try {
          const root = $getRoot();
          root.getChildren().forEach((node) => {
            console.log("Node type:", node.getType());
            if (node instanceof ImageNode) {
              console.log("Found image:", {
                src: node.__src,
                alt: node.__altText,
              });
            }
          });

          const markdownContent = $convertToMarkdownString(
            MARKDOWN_TRANSFORMERS,
            root
          );
          console.log("Final markdown:", markdownContent);
          setMarkdown(markdownContent || "");
        } catch (error) {
          console.error("Error:", error);
          setMarkdown("");
        }
      });
    });
  }, [editor]);

  return (
    <div className="flex gap-x-4 justify-end items-center p-2">
      <button
        className="btn btn-primary btn-outline"
        disabled={!hasContent}
        onClick={onCancel}
      >
        Retour
      </button>
      <button
        className="btn btn-primary"
        disabled={!hasContent}
        onClick={() => onSubmit(markdown)}
      >
        Enregistrer
      </button>
    </div>
  );
}

type EditorProps = {
  content: string;
  onCancel: () => void;
  onSubmit: (value: string) => void;
};

export default function Editor({ content, onCancel, onSubmit }: EditorProps) {
  const { sendRequest } = useHttp();

  const uploadImage = useCallback(
    async (blobInfo: any, _progress: any) => {
      try {
        const formData = new FormData();
        formData.append("image", blobInfo.blob(), blobInfo.filename());

        const response = await sendRequest({
          path: "/activity/blog-image",
          method: "post",
          body: formData,
        });
        console.log({ response });

        const imageUrl = "http://localhost:5001" + response.response;

        return imageUrl;
      } catch (error) {
        console.error("Erreur upload image:", error);
        return "error";
      }
    },
    [sendRequest]
  );

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin uploadImage={uploadImage} />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="editor-input"
                aria-placeholder={placeholder}
                placeholder={
                  <div className="editor-placeholder">{placeholder}</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ImagePlugin />
          <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
          <EditorContentManager
            onSubmit={onSubmit}
            content={content}
            onCancel={onCancel}
          />
        </div>
      </div>
    </LexicalComposer>
  );
}
