import { useState } from "react";
import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { Check, Copy } from "lucide-react"; // Icons for UI
import classes from "./code-block-with-copy.module.css"; // CSS file for styling

function CodeBlockWithCopy({ node }) {
  const [copied, setCopied] = useState(false);

  // Function to copy code content
  const copyToClipboard = async () => {
    const codeContent = node.content.text || ""; // Fetch code content properly

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
