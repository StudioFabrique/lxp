import { env } from "../../config/env.ts";
export type MailContext = { organizationName?: string };
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
};

export const layout = (
  content: string,
  name: string,
  options: LayoutOptions = {},
) => {
  const brand = options.officialAndriaLogo
    ? `<img src="cid:${ANDRIA_LOGO_CID}" width="181" height="59" alt="ANDRIA" style="display:block;width:181px;max-width:100%;height:auto;border:0;outline:none;text-decoration:none">`
    : `<span style="color:#ffffff;font-size:21px;font-weight:700;line-height:28px">${escapeHtml(name)}</span>`;
  const contentAlignment = options.contentAlignment ?? "left";

  return `<!doctype html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(name)}</title></head>
<body style="margin:0;padding:0;background-color:#f3f5f8;font-family:Arial,Helvetica,sans-serif;color:#17202a">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" bgcolor="#f3f5f8" style="width:100%;background-color:#f3f5f8">
    <tr>
      <td align="center" style="padding:40px 16px">
        <table role="presentation" width="600" border="0" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 18px rgba(23,32,42,0.08)">
          <tr><td bgcolor="#17202a" style="padding:24px 32px;background-color:#17202a">${brand}</td></tr>
          <tr><td align="${contentAlignment}" style="padding:32px;font-size:15px;line-height:24px;text-align:${contentAlignment}">${content}</td></tr>
          <tr><td style="padding:20px 32px;border-top:1px solid #e6eaee;color:#68737d;font-size:12px;line-height:18px;text-align:left">Cet e-mail a été envoyé par ${escapeHtml(name)}.</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
export const organizationName = (context: MailContext) =>
  context.organizationName?.trim() || "ANDRIA";
