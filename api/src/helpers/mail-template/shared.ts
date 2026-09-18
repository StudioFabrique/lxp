import { env } from "../../config/env.ts";
export type MailContext = {
  organizationName?: string;
  themeMode?: "light" | "dark";
  logoCid?: string;
  logoBackgroundColor?: string;
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
};

export const layout = (
  content: string,
  name: string,
  options: LayoutOptions = {},
) => {
  const homeLink = escapeHtml(instanceHomeUrl());
  const brand = options.officialAndriaLogo
    ? `<a href="${homeLink}" style="display:inline-block;text-decoration:none"><img src="cid:${ANDRIA_LOGO_CID}" width="181" height="59" alt="ANDRIA" style="display:block;width:181px;max-width:100%;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none"></a>`
    : options.logoCid
      ? `<img src="cid:${escapeHtml(options.logoCid)}" alt="${escapeHtml(name)}" style="display:block;max-width:220px;max-height:100px;width:auto;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none">`
      : "";
  const contentAlignment = options.contentAlignment ?? "left";
  const darkMode = options.themeMode === "dark";

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
        page: "#f3f5f8",
        card: "#f8fbff",
        header: "#17202a",
        text: "#17202a",
        muted: "#68737d",
        border: "#e6eaee",
      };
  const headerColor = options.officialAndriaLogo
    ? colors.header
    : /^#[0-9a-f]{6}$/i.test(options.logoBackgroundColor ?? "")
      ? options.logoBackgroundColor!
      : "#ffffff";
  const header = brand
    ? `<tr><td align="center" bgcolor="${headerColor}" style="padding:24px 32px 30px;background-color:${headerColor};text-align:center">${brand}</td></tr>`
    : "";
  const contentRadius = brand ? "18px 18px 0 0" : "12px 12px 0 0";
  const footerLogo = options.officialAndriaLogo
    ? ""
    : `<td align="right" valign="middle" style="padding:20px 32px 20px 12px;text-align:right"><a href="${homeLink}" style="display:inline-block;text-decoration:none"><img src="cid:${darkMode ? ANDRIA_FOOTER_LOGO_DARK_CID : ANDRIA_FOOTER_LOGO_LIGHT_CID}" width="80" alt="ANDRIA" style="display:block;width:80px;max-width:100%;height:auto;margin-left:auto;border:0;outline:none;text-decoration:none"></a></td>`;

  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(name)}</title></head>
<body style="margin:0;padding:0;background-color:${colors.page};font-family:Arial,Helvetica,sans-serif;color:${colors.text}">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${colors.page}" style="width:100%;background-color:${colors.page}">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0" bgcolor="${brand ? headerColor : colors.card}" style="width:100%;max-width:600px;background-color:${brand ? headerColor : colors.card};border-radius:12px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.16)">
          ${header}
          <tr><td align="${contentAlignment}" bgcolor="${colors.card}" style="padding:32px;background-color:${colors.card};border-radius:${contentRadius};color:${colors.text};font-size:15px;line-height:24px;text-align:${contentAlignment}">${content}</td></tr>
          ${options.showFooter === false ? "" : `<tr><td bgcolor="${colors.card}" style="padding:0;background-color:${colors.card};color:${colors.muted};font-size:12px;line-height:18px"><table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid ${colors.border};border-radius:${contentRadius}"><tr><td valign="middle" style="padding:20px 0 20px 32px;color:${colors.muted};text-align:left"><strong>${escapeHtml(name)}</strong></td>${footerLogo}</tr></table></td></tr>`}
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
});
