import {
  $applyNodeReplacement,
  createCommand,
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalCommand,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactNode } from "react";

export type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<ReactNode> {
  __src: string;
  __altText: string;
  __width: number | undefined;
  __height: number | undefined;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__width,
      node.__height,
      node.__key
    );
  }

  constructor(
    src: string,
    altText: string,
    width?: number,
    height?: number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width;
    this.__height = height;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const img = document.createElement("img");
    img.src = this.__src;
    img.alt = this.__altText;
    if (this.__width) img.width = this.__width;
    if (this.__height) img.height = this.__height;
    return img;
  }

  updateDOM(): false {
    return false;
  }

  static importDOM(): null {
    return null;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    if (this.__width) element.setAttribute("width", this.__width.toString());
    if (this.__height) element.setAttribute("height", this.__height.toString());
    return { element };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, altText, width, height } = serializedNode;
    const node = $createImageNode({
      src,
      altText,
      width,
      height,
    });
    return node;
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      altText: this.__altText,
      width: this.__width,
      height: this.__height,
      type: "image",
      version: 1,
    };
  }

  decorate(): ReactNode {
    return (
      <figure
        style={{
          margin: "1em 0",
          textAlign: "center",
          border: "1px solid #ddd",
          padding: "8px",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <img
          src={this.__src}
          alt={this.__altText}
          width={this.__width}
          height={this.__height}
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "0 auto",
          }}
        />
        {this.__altText && (
          <figcaption
            style={{ marginTop: "8px", color: "#666", fontSize: "0.9em" }}
          >
            {this.__altText}
          </figcaption>
        )}
      </figure>
    );
  }
}

export function $createImageNode({
  src,
  altText,
  width,
  height,
  key,
}: {
  src: string;
  altText: string;
  width?: number;
  height?: number;
  key?: NodeKey;
}): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, altText, width, height, key));
}

export const INSERT_IMAGE_COMMAND: LexicalCommand<{
  src: string;
  altText: string;
  width?: number;
  height?: number;
}> = createCommand("INSERT_IMAGE_COMMAND");
