import { env } from "../../config/env.ts";
export type MailContext = {
  organizationName?: string;
  themeMode?: "light" | "dark";
};
export const ANDRIA_LOGO_CID = "andria-official-logo";
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>'"]/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        c
      ]!,
  );
export const publicUrl = (path: string, params: Record<string, string>) => {
  const configuredUrl = env.FRONT_URL ?? "http://localhost:5173/";
  const baseUrl = configuredUrl.endsWith("/")
    ? configuredUrl
    : `${configuredUrl}/`;
  return `${baseUrl}${path}?${new URLSearchParams(params).toString()}`;
};
export const button = (link: string, label: string) =>
  `<table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin:28px auto"><tr><td bgcolor="#1769aa" style="border-radius:7px"><a href="${escapeHtml(link)}" style="display:inline-block;padding:13px 22px;color:#ffffff;font-size:14px;font-weight:700;line-height:20px;text-decoration:none">${escapeHtml(label)}</a></td></tr></table>`;

type LayoutOptions = {
  officialAndriaLogo?: boolean;
  contentAlignment?: "left" | "center";
  themeMode?: "light" | "dark";
};

export const layout = (
  content: string,
  name: string,
  options: LayoutOptions = {},
) => {
  const brand = options.officialAndriaLogo
    ? `<img src="cid:${ANDRIA_LOGO_CID}" width="181" height="59" alt="ANDRIA" style="display:block;width:181px;max-width:100%;height:auto;margin:0 auto;border:0;outline:none;text-decoration:none">`
    : `<span style="color:#ffffff;font-size:21px;font-weight:700;line-height:28px">${escapeHtml(name)}</span>`;
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
        card: "#ffffff",
        header: "#17202a",
        text: "#17202a",
        muted: "#68737d",
        border: "#e6eaee",
      };

  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(name)}</title></head>
<body style="margin:0;padding:0;background-color:${colors.page};font-family:Arial,Helvetica,sans-serif;color:${colors.text}">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="${colors.page}" style="width:100%;background-color:${colors.page}">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0" bgcolor="${colors.header}" style="width:100%;max-width:600px;background-color:${colors.header};border-radius:12px;overflow:hidden;box-shadow:0 4px 18px rgba(0,0,0,0.16)">
          <tr><td align="center" bgcolor="${colors.header}" style="padding:24px 32px 30px;background-color:${colors.header};text-align:center">${brand}</td></tr>
          <tr><td align="${contentAlignment}" bgcolor="${colors.card}" style="padding:32px;background-color:${colors.card};border-radius:18px 18px 0 0;color:${colors.text};font-size:15px;line-height:24px;text-align:${contentAlignment}">${content}</td></tr>
          <tr><td bgcolor="${colors.card}" style="padding:20px 32px;background-color:${colors.card};border-top:1px solid ${colors.border};color:${colors.muted};font-size:12px;line-height:18px;text-align:left">Cet e-mail a été envoyé par ${escapeHtml(name)}.</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
export const organizationName = (context: MailContext) =>
  context.organizationName?.trim() || "ANDRIA";
