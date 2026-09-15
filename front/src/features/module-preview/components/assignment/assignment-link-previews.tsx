import { useQuery } from "@tanstack/react-query";
import { Link2 } from "lucide-react";
import { useState } from "react";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import apiClient from "../../../../lib/axios";
import { assignmentLinks } from "./assignment-links";

type Preview = { title: string; favicon: string | null };

function Favicon({ src }: { src: string }) {
  const [iconFailed, setIconFailed] = useState(false);
  return <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-base-100" aria-hidden="true">
    {iconFailed ? <Link2 className="size-4" /> : <img src={src} alt="" className="size-5 object-contain" onError={() => setIconFailed(true)} />}
  </span>;
}

function LinkPreview({ url }: { url: string }) {
  const host = new URL(url).hostname;
  const preview = useQuery({
    queryKey: ["assignment-link-preview", url],
    queryFn: async () => (await apiClient.get<Preview>("/assignment/link-preview", { params: { url } })).data,
    staleTime: 24 * 60 * 60 * 1000,
    retry: false,
  });
  const title = preview.data?.title || host;
  const favicon = preview.data?.favicon ?? `${new URL(url).origin}/favicon.ico`;

  return <li>
    <BoxWrapper className="!h-auto !flex-row items-center gap-3 !p-3">
      <Favicon key={favicon} src={favicon} />
      <a href={url} target="_blank" rel="noopener noreferrer" className="min-w-0 flex-1 text-sm hover:underline">
        <span className="block truncate font-semibold">{title}</span>
        <span className="block truncate text-xs text-base-content/60">{url}</span>
      </a>
    </BoxWrapper>
  </li>;
}

export default function AssignmentLinkPreviews({ text }: { text: string }) {
  const links = assignmentLinks(text);
  if (links.length === 0) return null;
  return <div className="mt-3" aria-label="Aperçu des liens du devoir">
    <p className="mb-2 text-sm font-semibold">Liens du devoir</p>
    <ul className="space-y-2">{links.map(url => <LinkPreview key={url} url={url} />)}</ul>
  </div>;
}
