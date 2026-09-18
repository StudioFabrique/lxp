import { env } from "../../config/env.ts";
export type MailContext = { organizationName?: string };
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
  `<p style="margin:28px 0"><a href="${escapeHtml(link)}" style="display:inline-block;padding:12px 20px;background:#1769aa;color:#fff;text-decoration:none;border-radius:6px;font-weight:700">${label}</a></p>`;
export const layout = (content: string, name: string) =>
  `<!doctype html><html lang="fr"><body style="margin:0;background:#f4f6f8;font-family:Arial,sans-serif;color:#17202a;line-height:1.6"><div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden"><header style="padding:24px 32px;background:#17202a;color:#fff;font-size:20px;font-weight:700">${escapeHtml(name)}</header><main style="padding:32px">${content}</main><footer style="padding:20px 32px;color:#68737d;font-size:12px;border-top:1px solid #e8ecef">Cet e-mail a été envoyé par ${escapeHtml(name)}.</footer></div></body></html>`;
export const organizationName = (context: MailContext) =>
  context.organizationName?.trim() || "ANDRIA";
