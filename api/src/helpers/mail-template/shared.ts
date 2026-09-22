import { env } from "../../config/env.ts";
export type MailContext = {
  organizationName?: string;
  website?: string;
  themeMode?: "light" | "dark";
  logoCid?: string;
  logoBackgroundColor?: string;
  emailTemplate?: "minimal" | "gradient" | "editorial" | "soft" | "contrast" | "compact";
};
export const ANDRIA_LOGO_CID = "andria-official-logo";
export const ANDRIA_FOOTER_LOGO_LIGHT_CID = "andria-footer-light";
export const ANDRIA_FOOTER_LOGO_DARK_CID = "andria-footer-dark";
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ]!,
  );
export const formatDisplayTitle = (value: string) =>
  value.replace(/^(\s*)(\p{L})/u, (_, spaces: string, letter: string) =>
    spaces + letter.toUpperCase());

const relativeLuminance = (color: string) => {
  const channels = color
    .slice(1)
    .match(/.{2}/g)!
    .map((value) => parseInt(value, 16) / 255)
    .map((value) =>
      value <= 0.04045
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4),
    );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
};
export const instanceHomeUrl = () => {
  const configuredUrl = env.FRONT_URL ?? "http://localhost:5173/";
  return configuredUrl.endsWith("/") ? configuredUrl : `${configuredUrl}/`;
};
export const publicUrl = (path: string, params: Record<string, string>) =>
  `${instanceHomeUrl()}${path}?${new URLSearchParams(params).toString()}`;
export const button = (link: string, label: string) =>
  `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:28px auto"><tr><td bgcolor="#1769aa" style="border-radius:7px"><a href="${escapeHtml(link)}" style="display:inline-block;padding:13px 22px;color:#ffffff;font-size:14px;font-weight:700;line-height:20px;text-decoration:none">${escapeHtml(label)}</a></td></tr></table>`;

type LayoutOptions = {
  officialAndriaLogo?: boolean;
  showFooter?: boolean;
  contentAlignment?: "left" | "center";
  themeMode?: "light" | "dark";
  logoCid?: string;
  logoBackgroundColor?: string;
  emailTemplate?: MailContext["emailTemplate"];
  website?: string;
};

export const layout = (
  content: string,
  name: string,
  options: LayoutOptions = {},
) => {
  const homeLink = escapeHtml(instanceHomeUrl());
  const template = options.emailTemplate ?? "minimal";
  const centeredLogo =
    template === "minimal" || template === "soft" || template === "contrast";
  const officialBrand = options.officialAndriaLogo
    ? `<a href="${homeLink}" style="display:inline-block;text-decoration:none"><img src="cid:${ANDRIA_LOGO_CID}" width="181" height="59" alt="ANDRIA" style="display:block;width:181px;max-width:100%;height:auto;margin:${centeredLogo ? "0 auto" : "0"};border:0;outline:none;text-decoration:none"></a>`
    : "";
  const contentAlignment = options.contentAlignment ?? "left";
  const darkMode = options.themeMode === "dark";
  const instanceColor = /^#[0-9a-f]{6}$/i.test(options.logoBackgroundColor ?? "")
    ? options.logoBackgroundColor!
    : "#ffffff";

  const designs = {
    minimal: { radius: "12px", shadow: "0 4px 18px rgba(15,23,42,.12)", padding: "32px", width: "600", headerPadding: "24px 32px 30px", headerAlign: "center", border: "none" },
    gradient: { radius: "10px", shadow: "0 4px 16px rgba(15,23,42,.10)", padding: "28px", width: "600", headerPadding: "14px 24px", headerAlign: "left", border: "none" },
    editorial: { radius: "0", shadow: "0 2px 8px rgba(15,23,42,.10)", padding: "44px 48px", width: "620", headerPadding: "22px 48px", headerAlign: "left", border: `4px solid ${instanceColor}` },
    soft: { radius: "24px", shadow: "0 12px 32px rgba(15,23,42,.18)", padding: "38px 36px", width: "500", headerPadding: "24px 32px 10px", headerAlign: "center", border: "none" },
    contrast: { radius: "16px", shadow: "0 8px 26px rgba(15,23,42,.14)", padding: "36px 42px", width: "620", headerPadding: "42px 32px", headerAlign: "center", border: "none" },
    compact: { radius: "0", shadow: "none", padding: "24px 0", width: "560", headerPadding: "12px 0", headerAlign: "left", border: "none" },
  } as const;
  const design = designs[template];
  const forcedCenter = template === "editorial" || template === "soft" || template === "contrast";
  const renderedContentAlignment = forcedCenter ? "center" : contentAlignment;

  const colors = darkMode
    ? {
        page: "#0f172a",
        card: "#1e293b",
        header: "#111827",
        text: "#f8fafc",
        muted: "#aeb8c7",
        border: "#334155",
      }
    : {
        page: "#eef2f6",
        card: "#ffffff",
        header: "#17202a",
        text: "#17202a",
        muted: "#68737d",
        border: "#e6eaee",
      };
  const headerColor = options.officialAndriaLogo
    ? colors.header
    : /^#[0-9a-f]{6}$/i.test(options.logoBackgroundColor ?? "")
      ? options.logoBackgroundColor!
      : officialBrand
        ? colors.header
        : "#ffffff";
  const headerUsesColor = template === "minimal" || template === "gradient" || template === "contrast";
  const displayedHeaderColor = headerUsesColor ? headerColor : colors.card;
  const shouldUseInstanceColor =
    !options.officialAndriaLogo &&
    /^#[0-9a-f]{6}$/i.test(options.logoBackgroundColor ?? "") &&
    !/^#ffffff$/i.test(instanceColor);
  const accentColor = shouldUseInstanceColor ? instanceColor : "#1769aa";
  const cornerColor =
    /^#[0-9a-f]{6}$/i.test(options.logoBackgroundColor ?? "") &&
    relativeLuminance(instanceColor) < 0.88
      ? instanceColor
      : "#1769aa";
  const cornerUsesLightLogo = relativeLuminance(cornerColor) < 0.45;
  const accentTextColor = relativeLuminance(accentColor) > 0.45
    ? "#17202a"
    : "#ffffff";
  const themedContent = shouldUseInstanceColor
    ? content
        .replaceAll("#1769aa", instanceColor)
        .replaceAll("color:#ffffff", `color:${accentTextColor}`)
    : content;
  const pageColor =
    template === "soft"
      ? shouldUseInstanceColor
        ? instanceColor
        : "#eaf2f8"
      : template === "compact"
        ? colors.card
        : colors.page;
  const header = officialBrand
    ? `<tr><td align="${design.headerAlign}" bgcolor="${displayedHeaderColor}" style="padding:${design.headerPadding};background-color:${displayedHeaderColor};text-align:${design.headerAlign}">${officialBrand}</td></tr>`
    : "";
  const bannerColor = options.logoCid ? instanceColor : accentColor;
  const bannerBrand = options.logoCid
    ? `<img src="cid:${escapeHtml(options.logoCid)}" width="100" alt="${escapeHtml(name)}" style="display:block;width:100px;max-width:100%;max-height:46px;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none;object-fit:contain">`
    : `<strong style="color:#ffffff;font-size:18px">${escapeHtml(name)}</strong>`;
  const decoration =
    !officialBrand && template === "gradient"
      ? `<tr><td height="7" bgcolor="${accentColor}" style="height:7px;background-color:${accentColor};font-size:0;line-height:0">&nbsp;</td></tr>`
      : !officialBrand && template === "contrast"
        ? `<tr><td align="center" bgcolor="${bannerColor}" style="padding:22px 32px;background-color:${bannerColor};text-align:center">${bannerBrand}</td></tr>`
        : "";
  const contentRadius = officialBrand ? "18px 18px 0 0" : "12px 12px 0 0";
  const instanceFooterBrand = template === "contrast"
    ? "&nbsp;"
    : options.logoCid
    ? `<img src="cid:${escapeHtml(options.logoCid)}" width="80" alt="${escapeHtml(name)}" style="display:block;width:80px;max-width:100%;max-height:32px;height:auto;border:0;outline:none;text-decoration:none;object-fit:contain">`
    : `<strong>${escapeHtml(name)}</strong>`;
  const footerLogo = options.officialAndriaLogo
    ? ""
    : template === "contrast"
      ? `<td align="right" valign="top" style="padding:0;text-align:right"><table role="presentation" border="0" cellpadding="0" cellspacing="0" align="right"><tr><td bgcolor="${cornerColor}" style="padding:18px 32px 18px 24px;background-color:${cornerColor};border-radius:8px 0 0 0"><a href="${homeLink}" style="display:inline-block;text-decoration:none"><img src="cid:${cornerUsesLightLogo ? ANDRIA_FOOTER_LOGO_DARK_CID : ANDRIA_FOOTER_LOGO_LIGHT_CID}" width="80" alt="ANDRIA" style="display:block;width:80px;max-width:100%;height:auto;margin-left:auto;border:0;outline:none;text-decoration:none"></a></td></tr></table></td>`
      : `<td align="right" valign="top" style="padding:20px 32px 20px 12px;text-align:right"><a href="${homeLink}" style="display:inline-block;text-decoration:none"><img src="cid:${darkMode ? ANDRIA_FOOTER_LOGO_DARK_CID : ANDRIA_FOOTER_LOGO_LIGHT_CID}" width="80" alt="ANDRIA" style="display:block;width:80px;max-width:100%;height:auto;margin-left:auto;border:0;outline:none;text-decoration:none"></a></td>`;
  const footerBorder = template === "contrast" ? "none" : `1px solid ${colors.border}`;
  const website = options.website?.trim();
  const websiteLink = website
    ? `<a href="${escapeHtml(website)}" style="color:${colors.muted};font-size:12px;line-height:18px;text-decoration:underline;word-break:break-all">${escapeHtml(website)}</a>`
    : "";
  const footerLeft = template === "contrast"
    ? websiteLink
    : `${instanceFooterBrand}${websiteLink ? `<div style="padding-top:8px">${websiteLink}</div>` : ""}`;

  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(name)}</title></head>
<body style="margin:0;padding:0;background-color:${pageColor};font-family:Arial,Helvetica,sans-serif;color:${colors.text}">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${pageColor}" style="width:100%;background-color:${pageColor}">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table role="presentation" width="${design.width}" border="0" cellpadding="0" cellspacing="0" bgcolor="${officialBrand ? displayedHeaderColor : colors.card}" style="width:100%;max-width:${design.width}px;background-color:${officialBrand ? displayedHeaderColor : colors.card};border-radius:${design.radius};overflow:hidden;box-shadow:${design.shadow};${template === "editorial" ? `border-top:4px solid ${accentColor};border-bottom:4px solid ${accentColor}` : ""}">
          ${header}
          ${decoration}
          <tr><td align="${renderedContentAlignment}" bgcolor="${colors.card}" style="padding:${design.padding};background-color:${colors.card};border-radius:${contentRadius};color:${colors.text};font-size:15px;line-height:24px;text-align:${renderedContentAlignment}">${themedContent}</td></tr>
          ${options.showFooter === false ? "" : `<tr><td bgcolor="${colors.card}" style="padding:0;background-color:${colors.card};color:${colors.muted};font-size:12px;line-height:18px"><table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-top:${footerBorder};border-radius:${contentRadius}"><tr><td valign="top" style="padding:${template === "contrast" ? "18px 0 18px 32px" : "20px 0 20px 32px"};color:${colors.muted};text-align:left">${footerLeft}</td>${footerLogo}</tr></table></td></tr>`}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
export const organizationName = (context: MailContext) =>
  context.organizationName?.trim() || "ANDRIA";
export const instanceBrand = (context: MailContext) => ({
  logoCid: context.logoCid,
  logoBackgroundColor: context.logoBackgroundColor,
  themeMode: context.themeMode,
  emailTemplate: context.emailTemplate,
  website: context.website,
});
