import { useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Check, Copy } from "lucide-react"; // Icons for UI
import classes from "./code-block-with-copy.module.css"; // CSS file for styling

function CodeBlockWithCopy({ node, getPos, editor }) {
  const [copied, setCopied] = useState(false);

  // Function to copy code content
  const copyToClipboard = async () => {
    // Get the actual text content from the editor's state
    const from = getPos() + 1; // +1 to skip the node start position
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
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
}

export default CodeBlockWithCopy;
