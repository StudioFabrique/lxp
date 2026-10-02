import andriaLogo from "../../../assets/andria-logo/logo-lightmode-email.png";
import andriaLogoLight from "../../../assets/andria-logo/logo-darkmode-email.png";
import { INSTANCE_LOGO } from "../../../config/urls";
import { cn } from "../../../utils/cn";
import { emailTemplates } from "./email-template-settings.utils";

export function EmailPreview({
  template,
  instanceName,
  website,
  hasInstanceLogo,
  instanceColor,
}: {
  template: (typeof emailTemplates)[number];
  instanceName: string;
  website: string;
  hasInstanceLogo: boolean;
  instanceColor: string;
}) {
  const configuredAccent = instanceColor || "#ffffff";
  const accent = /^#(?:fff|ffffff)$/i.test(configuredAccent)
    ? "#1769aa"
    : configuredAccent;
  const colorLuminance = (color: string) => {
    const channels = color.slice(1).match(/.{2}/g)?.map((value) => {
      const channel = Number.parseInt(value, 16) / 255;
      return channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return channels?.length === 3
      ? 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
      : 1;
  };
  const cornerColor = colorLuminance(configuredAccent) < 0.88
    ? configuredAccent
    : "#1769aa";
  const cornerLogo = colorLuminance(cornerColor) < 0.45
    ? andriaLogoLight
    : andriaLogo;
  const accentTextColor = colorLuminance(accent) > 0.45
    ? "#17202a"
    : "#ffffff";
  const mutedColor = "#9ca3af";
  const isEditorial = template.id === "editorial";
  const isInvitation = template.id === "soft";
  const isBanner = template.id === "contrast";
  const isBare = template.id === "compact";

  return (
    <div
      className="aspect-[16/11] overflow-hidden p-3"
      style={{ backgroundColor: isInvitation ? `${accent}20` : isBare ? "#ffffff" : "#f1f5f9" }}
      aria-hidden="true"
    >
      <div
        className={cn("relative mx-auto flex h-full flex-col bg-white text-[#17202a]", isEditorial ? "max-w-64 rounded-none border-y-4" : isBare ? "max-w-64 rounded-none shadow-none" : isInvitation ? "my-1 max-w-52 rounded-2xl shadow-lg" : "max-w-64 rounded-xl shadow-sm")}
        style={{
          borderColor: isEditorial ? accent : undefined,
        }}
      >
        {template.id === "gradient" && (
          <div className="h-1.5 shrink-0" style={{ backgroundColor: accent }} />
        )}
        {isBanner && (
          <div
            className="flex h-12 shrink-0 items-center justify-center px-4"
            style={{ backgroundColor: hasInstanceLogo ? configuredAccent : accent }}
          >
            {hasInstanceLogo ? (
              <img src={INSTANCE_LOGO} alt="" className="h-auto max-h-8 w-14 object-contain" />
            ) : (
              <span className="text-[9px] font-bold text-white">
                {instanceName || "Votre organisme"}
              </span>
            )}
          </div>
        )}
        <div className={cn("flex flex-1 flex-col px-4 py-3", (isEditorial || isInvitation || isBanner) && "text-center")}>
          <div className="mb-2 text-[9px] font-bold">Bienvenue parmi nous !</div>
          <div className="space-y-1.5">
            <div className="h-1 w-full rounded bg-current opacity-15" />
            <div className="h-1 w-4/5 rounded bg-current opacity-15" />
          </div>
          <span
            className="mt-3 inline-block w-fit rounded px-3 py-1 text-[6px] font-bold text-white"
            style={{ backgroundColor: accent, alignSelf: isEditorial || isInvitation || isBanner ? "center" : undefined, color: accentTextColor }}
          >
            Découvrir mon espace
          </span>
          <div
            className={cn("mt-auto flex justify-between", website ? "items-start" : "items-center", isBanner ? "-mb-3 -mr-4" : "border-t pt-2")}
            style={{ borderColor: mutedColor }}
          >
            {isBanner ? (
              <span className="max-w-24 truncate text-[6px] underline" style={{ color: mutedColor }}>
                {website}
              </span>
            ) : hasInstanceLogo ? (
              <span className="flex flex-col items-start gap-1">
                <img src={INSTANCE_LOGO} alt="" className="h-auto max-h-5 w-10 object-contain" />
                {website && <span className="max-w-24 truncate text-[6px] underline" style={{ color: mutedColor }}>{website}</span>}
              </span>
            ) : (
              <span className="flex max-w-24 flex-col text-[6px]" style={{ color: mutedColor }}>
                <span className="truncate">{instanceName || "Votre organisme"}</span>
                {website && <span className="truncate underline">{website}</span>}
              </span>
            )}
            <span
              className={cn(isBanner ? "rounded-tl-lg px-3 py-2" : undefined)}
              style={{ backgroundColor: isBanner ? cornerColor : undefined }}
            >
              <img src={isBanner ? cornerLogo : andriaLogo} alt="" className="h-auto w-10 object-contain" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
