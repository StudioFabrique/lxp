import { useState } from "react";
import { Globe2 } from "lucide-react";
import type { Link } from "../../../user/interfaces/link";

export default function LinkPreview({ link }: { link: Link }) {
  const [iconFailed, setIconFailed] = useState(false);
  let hostname = link.url;
  let favicon = "";
  try {
    const parsed = new URL(link.url);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      hostname = parsed.hostname;
      favicon = `${parsed.origin}/favicon.ico`;
    }
  } catch { /* Afficher l'adresse reçue. */ }
  return <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-2 text-sm text-primary hover:underline">
    {favicon && !iconFailed ? <img src={favicon} alt="" className="size-5 shrink-0 rounded-sm object-contain" onError={() => setIconFailed(true)} /> : <Globe2 className="size-5 shrink-0" aria-hidden />}
    <span className="min-w-0 truncate">{link.alias || hostname}</span><span className="sr-only">{link.url}</span>
  </a>;
}
