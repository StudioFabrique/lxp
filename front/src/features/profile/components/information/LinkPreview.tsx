import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe2 } from "lucide-react";
import type { Link } from "../../../user/interfaces/link";
import apiClient from "../../../../lib/axios";

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
  const preview = useQuery({
    queryKey: ["profile-link-preview", link.url],
    queryFn: async () => (await apiClient.get<{ favicon: string | null }>("/assignment/link-preview", { params: { url: link.url } })).data,
    enabled: Boolean(favicon),
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
  favicon = preview.data?.favicon ?? favicon;
  useEffect(() => setIconFailed(false), [favicon]);
  return <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-2 text-sm text-primary hover:underline">
    {favicon && !iconFailed ? <img src={favicon} alt="" className="size-5 shrink-0 rounded-sm object-contain" onError={() => setIconFailed(true)} /> : <Globe2 className="size-5 shrink-0" aria-hidden />}
    <span className="min-w-0 truncate">{link.alias || hostname}</span><span className="sr-only">{link.url}</span>
  </a>;
}
