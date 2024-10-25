/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRef, useState } from "react";
import TurndownService from "turndown";
import { marked } from "marked";
import DOMPurify from "dompurify";
/**
 * Hook personnalisé pour gérer l'édition de blog avec conversion HTML/Markdown
 *
 * Ce hook gère la conversion bidirectionnelle entre HTML et Markdown pour l'édition de contenu.
 * Il utilise TinyMCE comme éditeur riche (via editorRef) et offre des fonctionnalités de:
 * - Conversion de HTML vers Markdown
 * - Conversion de Markdown vers HTML
 * - Assainissement du HTML pour la sécurité
 *
 * Retourne un objet contenant:
 * - content: Le contenu HTML assaini
 * - editorRef: Référence vers l'éditeur TinyMCE
 * - log: Fonction pour déclencher la conversion
 * - markdown: Le contenu au format Markdown
 */
const useEditBlog = () => {
  const editorRef = useRef<any>(null);
  const [markdown, setMarkdown] = useState("");
  const [content, setContent] = useState("");

  const log = async () => {
    if (editorRef && editorRef.current) {
      const htmlContent = editorRef.current!.getContent();
      const turndownService = new TurndownService();
      const markdownContent = turndownService.turndown(htmlContent);
      setMarkdown(markdownContent);
      // Convert Markdown back to HTML
      let htmlFromMarkdown = await marked(markdownContent);
      // Sanitize the HTML
      htmlFromMarkdown = DOMPurify.sanitize(htmlFromMarkdown);
      setContent(htmlFromMarkdown);
    }
  };

  return { content, editorRef, log, markdown };
};

export default useEditBlog;
