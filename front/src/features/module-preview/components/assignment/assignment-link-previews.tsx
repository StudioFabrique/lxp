import { assignmentLinks } from "./assignment-links";
import { LinkPreview } from "./link-preview";

export default function AssignmentLinkPreviews({ text }: { text: string }) {
  const links = assignmentLinks(text);
  if (links.length === 0) return null;
  return <div className="mt-3" aria-label="Aperçu des liens du devoir">
    <p className="mb-2 text-sm font-semibold">Liens du devoir</p>
    <ul className="space-y-2">{links.map(url => <LinkPreview key={url} url={url} />)}</ul>
  </div>;
}
