import htmlToMarkdown from "@wcj/html-to-markdown";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export async function markdownToHtml(markdownText: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeFormat)
    .use(rehypeStringify)
    .process(markdownText);

  return String(file);
}

export async function fromHtmlToMarkdown(htmlText: string) {
  const file = await htmlToMarkdown({ html: htmlText });

  return file;
}
