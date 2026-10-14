import { useQuery } from "@tanstack/react-query";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import apiClient from "../../../../lib/axios";
import { Favicon } from "./favicon";

type Preview = { title: string; favicon: string | null };

export function LinkPreview({ url }: { url: string }) {
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
