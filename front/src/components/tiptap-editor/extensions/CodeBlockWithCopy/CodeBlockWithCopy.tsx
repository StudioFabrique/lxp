import { useState } from "react";
import {
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from "@tiptap/react";
import { Check, Copy } from "lucide-react"; // Icons for UI
import classes from "./code-block-with-copy.module.css"; // CSS file for styling
import "highlight.js/styles/github-dark.css";

function CodeBlockWithCopy({ node, getPos, editor }: NodeViewProps) {
  const [copied, setCopied] = useState(false);

  // Function to copy code content
  const copyToClipboard = async () => {
    // Get the actual text content from the editor's state
    const position = getPos();
    if (position === undefined) return;

    const from = position + 1; // +1 to skip the node start position
    const to = from + node.content.size;
    const codeContent = editor.state.doc.textBetween(from, to, "\n");

    if (codeContent) {
      await navigator.clipboard.writeText(codeContent);
      setCopied(true);

      // Reset "copied" state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <NodeViewWrapper className={classes.codeBlock}>
      {/* Copy Button */}
      <button
        type="button"
        onClick={copyToClipboard}
        className={classes.copyButton}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>

      {/* Render code content */}
      <pre>
        {/* `NodeViewContent` type `as` en "div" alors qu'il accepte n'importe
            quel élément : le contenu d'un bloc de code se rend en `code`. */}
        <NodeViewContent as={"code" as "div"} />
      </pre>
    </NodeViewWrapper>
  );
}

export default CodeBlockWithCopy;
