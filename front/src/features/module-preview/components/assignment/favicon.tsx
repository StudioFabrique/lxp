import { Link2 } from "lucide-react";
import { useState } from "react";

export function Favicon({ src }: { src: string }) {
  const [iconFailed, setIconFailed] = useState(false);
  return <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-base-100" aria-hidden="true">
    {iconFailed ? <Link2 className="size-4" /> : <img src={src} alt="" className="size-5 object-contain" onError={() => setIconFailed(true)} />}
  </span>;
}
